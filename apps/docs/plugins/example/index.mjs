import { createHash } from "node:crypto";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { generate } from "astring";
import { format } from "oxfmt";
import { visit, SKIP } from "unist-util-visit";
import { previewId, registerPreview } from "./virtual-previews.mjs";

const JsxParser = Parser.extend(jsx());

const PRETTIER_OPTS = {
  tabWidth: 2,
  printWidth: 80,
  singleQuote: false,
  semi: true,
};

/**
 * Private identifiers we own and inject. The `__` prefix sidesteps name
 * collisions with whatever the author already imports.
 */
const RENDERER_NAME = "__ExampleRenderer";
const PREVIEW_PREFIX = "__ExamplePreview";
const RENDERER_IMPORT = `import ${RENDERER_NAME} from "@example/Example.astro";`;

/**
 * Rewrites `:::example` directives into the existing Example renderer.
 * Authoring lives in plain markdown:
 *
 *     :::example
 *
 *     ```html
 *     <button class="btn btn-primary">Save</button>
 *     ```
 *
 *     ```tsx
 *     <Button variant="primary">Save</Button>
 *     ```
 *
 *     :::
 *
 * Either fence may be omitted. The tsx fence is compiled into a default-
 * exported React component, registered as a virtual module
 * (`virtual:example-preview/<hash>.tsx`), and hydrated as a client island
 * by Astro. Wrapping the whole preview in one component means Astro routes
 * the entire subtree through a single React SSR pass and hydrates the same
 * tree on the client — required for context-publishing primitives (`Field`,
 * `RadioGroup`, `Tabs.Root`, `Select.Root`) to reach their descendants, and
 * for Base UI's stateful components (Tabs, Checkbox, Radio, Switch, Select,
 * Menu) to be interactive at all.
 *
 * @returns {(tree: import("mdast").Root, file: import("vfile").VFile) => Promise<void>}
 */
export default function remarkExample() {
  return async (tree, file) => {
    /** @type {any[]} */
    const jobs = [];
    visit(tree, (node) => {
      if (
        node.type !== "containerDirective" ||
        /** @type {{ name?: string }} */ (node).name !== "example"
      ) {
        return;
      }
      jobs.push(node);
      return SKIP;
    });

    if (jobs.length === 0) return;

    // Capture the author's top-level ImportDeclarations BEFORE we inject our
    // own. Each virtual preview module is built on top of these so that
    // identifiers like `<Checkbox>` or `<Field>` resolve the same way they
    // do in the surrounding MDX.
    const userImportsBlock = collectMdxImports(tree).join("\n");

    /** @type {string[]} */
    const previewImports = [];
    let previewCount = 0;

    await Promise.all(
      jobs.map(async (node) => {
        const fences = collectFences(node.children ?? []);

        if (fences.html === undefined && fences.tsx === undefined) {
          file.message("`:::example` block needs at least one ```html or ```tsx fence", node);
          return;
        }

        const [html, react] = await Promise.all([
          fences.html !== undefined ? formatHtml(fences.html) : undefined,
          fences.tsx !== undefined ? formatReact(fences.tsx) : undefined,
        ]);

        const attributes = [];
        if (html !== undefined) attributes.push(stringAttr("html", html));
        if (react !== undefined) attributes.push(stringAttr("react", react));

        /** @type {any[]} */
        const children = [];
        if (react !== undefined) {
          const previewSource = buildPreviewSource(userImportsBlock, react);
          const moduleId = previewId(hash(previewSource));
          registerPreview(moduleId, previewSource);

          const previewName = `${PREVIEW_PREFIX}${previewCount++}`;
          previewImports.push(`import ${previewName} from "${moduleId}";`);

          children.push({
            type: "mdxJsxFlowElement",
            name: previewName,
            attributes: [
              { type: "mdxJsxAttribute", name: "client:load", value: null },
              { type: "mdxJsxAttribute", name: "slot", value: "preview" },
            ],
            children: [],
          });
        }

        Object.assign(node, {
          type: "mdxJsxFlowElement",
          name: RENDERER_NAME,
          attributes,
          children,
        });
      }),
    );

    const esmSource = [RENDERER_IMPORT, ...previewImports].join("\n");
    injectEsm(tree, esmSource);
  };
}

/**
 * @param {import("mdast").Root} tree
 * @returns {string[]}
 */
function collectMdxImports(tree) {
  /** @type {string[]} */
  const sources = [];
  visit(tree, (node) => {
    if (node.type !== "mdxjsEsm") return;
    /** @type {any} */
    let program;
    try {
      program = JsxParser.parse(/** @type {any} */ (node).value, {
        ecmaVersion: "latest",
        sourceType: "module",
      });
    } catch {
      return;
    }
    for (const stmt of program.body) {
      if (stmt.type !== "ImportDeclaration") continue;
      // Astro components (other docs-only helpers like <Reference>) can't live
      // inside the React preview's virtual TSX module — skip them.
      if (String(stmt.source.value ?? "").endsWith(".astro")) continue;
      sources.push(generate(stmt).trim());
    }
  });
  return sources;
}

/**
 * Build the TSX source for one preview's virtual module. The returned source
 * is hashed to derive the module id, so any change here invalidates the
 * cache across the workspace.
 *
 * @param {string} importsBlock
 * @param {string} reactSource
 */
function buildPreviewSource(importsBlock, reactSource) {
  const header = importsBlock.length > 0 ? `${importsBlock}\n\n` : "";
  const adminRootImport = `import { AdminRoot as __ExampleAdminRoot } from "@aortl/admin-react";`;
  return `${adminRootImport}\n${header}export default function ExamplePreview() {
  return (
    <__ExampleAdminRoot>
${indent(reactSource, 6)}
    </__ExampleAdminRoot>
  );
}
`;
}

/** @param {string} s */
function hash(s) {
  return createHash("sha1").update(s).digest("hex").slice(0, 16);
}

/**
 * @param {readonly any[]} children
 * @returns {{ html?: string; tsx?: string }}
 */
function collectFences(children) {
  /** @type {{ html?: string; tsx?: string }} */
  const out = {};
  for (const child of children) {
    if (child?.type !== "code") continue;
    if (child.lang === "html" && out.html === undefined) out.html = child.value;
    else if ((child.lang === "tsx" || child.lang === "jsx") && out.tsx === undefined) {
      out.tsx = child.value;
    }
  }
  return out;
}

/**
 * Multi-line strings are fine — @mdx-js/mdx compiles JSX attributes into JS
 * object properties (`_jsx(Example, { html: "..." })`), not JSX `attr="..."`
 * syntax, so newlines are just `\n` in the emitted string literal.
 *
 * @param {string} name
 * @param {string} value
 */
function stringAttr(name, value) {
  return { type: "mdxJsxAttribute", name, value };
}

/**
 * Inject a single `mdxjsEsm` node at the top of the document carrying the
 * renderer import and every preview-module import for this file.
 *
 * @param {import("mdast").Root} tree
 * @param {string} source
 */
function injectEsm(tree, source) {
  const program = /** @type {any} */ (
    JsxParser.parse(source, { ecmaVersion: "latest", sourceType: "module" })
  );
  /** @type {any} */
  const node = {
    type: "mdxjsEsm",
    value: source,
    data: { estree: program },
  };
  tree.children.unshift(node);
}

/**
 * @param {string} text
 * @param {number} n
 */
function indent(text, n) {
  const pad = " ".repeat(n);
  return text
    .split("\n")
    .map((l) => (l.length > 0 ? pad + l : l))
    .join("\n");
}

/** @param {string} s */
function dedent(s) {
  const lines = s.split("\n");
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => /^ */.exec(l)?.[0].length ?? 0);
  const min = indents.length > 0 ? Math.min(...indents) : 0;
  return lines
    .map((l) => l.slice(min))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

/** @param {string} code */
async function formatHtml(code) {
  const wrapped = `<div>\n${code}\n</div>`;
  const out = (
    await format("snippet.html", wrapped, { ...PRETTIER_OPTS, parser: "html" })
  ).code.trim();
  const inner = out.replace(/^<div>\n?/, "").replace(/\n?<\/div>\s*$/, "");
  return dedent(inner);
}

/** @param {string} code */
async function formatReact(code) {
  const wrapped = `<>\n${code}\n</>;\n`;
  const out = (
    await format("snippet.tsx", wrapped, {
      ...PRETTIER_OPTS,
      parser: "babel-ts",
    })
  ).code.trim();
  const inner = out.replace(/^<>\n?/, "").replace(/\n?<\/>;?\s*$/, "");
  return dedent(inner);
}
