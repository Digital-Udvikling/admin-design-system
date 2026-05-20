import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { generate } from "astring";
import { buildJsx } from "estree-util-build-jsx";
import { format } from "oxfmt";
import { visit, SKIP } from "unist-util-visit";

const JsxParser = Parser.extend(jsx());

const PRETTIER_OPTS = {
  tabWidth: 2,
  printWidth: 80,
  singleQuote: false,
  semi: true,
};

/**
 * Private identifiers we own and inject. Using a `__` prefix sidesteps name
 * collisions with whatever the author already imports, which lets us always
 * inject the renderer without scanning the tree first.
 */
const RENDERER_NAME = "__ExampleRenderer";
const PREVIEW_PREFIX = "__ExamplePreview";
const REACT_NS = "__ExampleReact";
const RENDERER_IMPORT = `import ${RENDERER_NAME} from "@docs/components/Example.astro";`;
const REACT_IMPORT = `import * as ${REACT_NS} from "react";`;

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
 * Either fence may be omitted. The tsx fence is wrapped in a per-example
 * function component (`__ExamplePreviewN`) so the React preview is one VNode
 * from Astro's perspective — Astro renders it through a single React SSR
 * pass, which keeps context-publishing primitives (`Field`, `RadioGroup`,
 * `Select.Root`) connected to their descendants. Going through `<slot />`
 * breaks that.
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

    /** @type {string[]} */
    const previewDeclarations = [];
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

        if (react !== undefined) {
          const previewName = `${PREVIEW_PREFIX}${previewCount++}`;
          previewDeclarations.push(
            `const ${previewName} = () => (\n  <>\n${indent(react, 4)}\n  </>\n);`,
          );
          attributes.push(identifierAttr("preview", previewName));
        }

        Object.assign(node, {
          type: "mdxJsxFlowElement",
          name: RENDERER_NAME,
          attributes,
          children: [],
        });
      }),
    );

    const esmSource = [
      RENDERER_IMPORT,
      ...(previewDeclarations.length > 0 ? [REACT_IMPORT] : []),
      ...previewDeclarations,
    ].join("\n\n");
    injectEsm(tree, esmSource);
  };
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
 * `preview={someIdentifier}` — the value is a JSX expression whose ESTree
 * is a single identifier reference into the injected esm scope.
 *
 * @param {string} name
 * @param {string} identifier
 */
function identifierAttr(name, identifier) {
  const program = JsxParser.parse(identifier, {
    ecmaVersion: "latest",
    sourceType: "module",
  });
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: identifier,
      data: { estree: program },
    },
  };
}

/**
 * Inject a single `mdxjsEsm` node at the top of the document carrying the
 * renderer import and every preview function for this file. JSX inside the
 * preview FCs is transformed to `react/jsx-runtime` calls right here —
 * Astro's MDX integration compiles the surrounding document with its own
 * JSX runtime (which produces Astro VNodes), and those don't render inside
 * React's SSR pass. Pinning the FCs to React's runtime guarantees one
 * coherent React tree from `ReactPreview` down.
 *
 * @param {import("mdast").Root} tree
 * @param {string} source
 */
function injectEsm(tree, source) {
  const program = /** @type {any} */ (
    JsxParser.parse(source, { ecmaVersion: "latest", sourceType: "module" })
  );
  buildJsx(program, {
    runtime: "classic",
    pragma: `${REACT_NS}.createElement`,
    pragmaFrag: `${REACT_NS}.Fragment`,
  });
  /** @type {any} */
  const node = {
    type: "mdxjsEsm",
    value: generate(program),
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
