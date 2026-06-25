import { createHash } from "node:crypto";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { generate } from "astring";
import { format } from "oxfmt";
import { previewId, registerPreview } from "./virtual-previews.mjs";

const JsxParser = Parser.extend(jsx());

const PRETTIER_OPTS = {
  tabWidth: 2,
  printWidth: 80,
  singleQuote: false,
  semi: true,
};

/** Injected identifiers; the `__` prefix avoids collisions with author imports. */
const RENDERER_NAME = "__ExampleRenderer";
const PREVIEW_PREFIX = "__ExamplePreview";
const RENDERER_IMPORT = `import ${RENDERER_NAME} from "@example/Example.astro";`;

/**
 * Sätteri MDAST plugin (factory — fresh per-document closure state) that rewrites
 * `:::example` directives (with optional ```html / ```tsx fences) into the Example
 * renderer. The tsx fence is compiled into a default-exported component, registered
 * as a virtual module (`virtual:example-preview/<hash>.tsx`), and hydrated as one
 * client island — a single React SSR pass + hydration tree is required for
 * context-publishing primitives (`Field`, `RadioGroup`, `Select.Root`) to reach
 * descendants and for Base UI's stateful components to be interactive at all.
 *
 * Directive syntax is parsed natively by Sätteri (`features.directive`); the
 * `mdxjsEsm` and `containerDirective` visitors run in document order within one
 * pass, so author imports (at the top of every page) are collected before any
 * example below them is transformed.
 *
 * @returns {import("@astrojs/markdown-satteri").MdastPluginDefinition}
 */
export default function remarkExample() {
  /** Author imports, reused verbatim inside each preview module so identifiers
   *  resolve as they do in the surrounding MDX. */
  const userImports = [];
  let previewCount = 0;
  let rendererInjected = false;

  return {
    name: "admin-example",

    mdxjsEsm(node) {
      let program;
      try {
        program = JsxParser.parse(node.value, {
          ecmaVersion: "latest",
          sourceType: "module",
        });
      } catch {
        return;
      }
      for (const stmt of program.body) {
        if (stmt.type !== "ImportDeclaration") continue;
        // Astro components can't live inside the React preview's TSX module.
        if (String(stmt.source.value ?? "").endsWith(".astro")) continue;
        userImports.push(generate(stmt).trim());
      }
    },

    async containerDirective(node, ctx) {
      if (node.name !== "example") return;

      const fences = collectFences(node.children ?? []);
      if (fences.html === undefined && fences.tsx === undefined) {
        ctx.report({
          message: "`:::example` block needs at least one ```html or ```tsx fence",
          node,
          severity: "warning",
        });
        return;
      }

      // Allocate shared state synchronously, before the first `await`, so
      // concurrent async visitors keep deterministic names and inject the
      // renderer import exactly once regardless of resume order.
      const injectRenderer = !rendererInjected;
      rendererInjected = true;
      const previewName = fences.tsx !== undefined ? `${PREVIEW_PREFIX}${previewCount++}` : null;
      const authorImports = userImports.join("\n");

      const [html, react] = await Promise.all([
        fences.html !== undefined ? formatHtml(fences.html, ctx, node) : undefined,
        fences.tsx !== undefined ? formatReact(fences.tsx, ctx, node) : undefined,
      ]);

      const attributes = [];
      if (html !== undefined) attributes.push(exprAttr("html", html));
      if (react !== undefined) attributes.push(exprAttr("react", react));

      const imports = [];
      if (injectRenderer) imports.push(RENDERER_IMPORT);

      const children = [];
      if (react !== undefined && previewName !== null) {
        const previewSource = buildPreviewSource(authorImports, react);
        const moduleId = previewId(hash(previewSource));
        registerPreview(moduleId, previewSource);
        imports.push(`import ${previewName} from "${moduleId}";`);
        children.push({
          type: "mdxJsxFlowElement",
          name: previewName,
          attributes: [boolAttr("client:load"), stringAttr("slot", "preview")],
          children: [],
        });
      }

      if (imports.length > 0) {
        ctx.insertBefore(node, { type: "mdxjsEsm", value: imports.join("\n") });
      }

      return {
        type: "mdxJsxFlowElement",
        name: RENDERER_NAME,
        attributes,
        children,
      };
    },
  };
}

/**
 * TSX source for one preview's virtual module. The source is hashed into the
 * module id, so any change here invalidates the cache.
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
 * String-valued JSX attribute (`name="value"`). Safe only for control values
 * without quotes/newlines (`slot`).
 *
 * @param {string} name
 * @param {string} value
 */
function stringAttr(name, value) {
  return { type: "mdxJsxAttribute", name, value };
}

/** Valueless JSX attribute (`client:load`). @param {string} name */
function boolAttr(name) {
  return { type: "mdxJsxAttribute", name, value: null };
}

/**
 * Expression-valued JSX attribute (`name={"..."}`). The value rides through as a
 * JS string literal, so arbitrary HTML/TSX (quotes, newlines) survives intact.
 *
 * @param {string} name
 * @param {string} value
 */
function exprAttr(name, value) {
  return {
    type: "mdxJsxAttribute",
    name,
    value: { type: "mdxJsxAttributeValueExpression", value: JSON.stringify(value) },
  };
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

/**
 * @param {string} code
 * @param {import("@astrojs/markdown-satteri").MdastVisitorContext} ctx
 * @param {any} node
 */
async function formatHtml(code, ctx, node) {
  const wrapped = `<div>\n${code}\n</div>`;
  const result = await format("snippet.html", wrapped, { ...PRETTIER_OPTS, parser: "html" });
  failOnFormatErrors(result, ctx, node, "html");
  const out = result.code.trim();
  const inner = out.replace(/^<div>\n?/, "").replace(/\n?<\/div>\s*$/, "");
  return dedent(inner);
}

/**
 * @param {string} code
 * @param {import("@astrojs/markdown-satteri").MdastVisitorContext} ctx
 * @param {any} node
 */
async function formatReact(code, ctx, node) {
  const wrapped = `<>\n${code}\n</>;\n`;
  const result = await format("snippet.tsx", wrapped, {
    ...PRETTIER_OPTS,
    parser: "babel-ts",
  });
  failOnFormatErrors(result, ctx, node, "tsx");
  const out = result.code.trim();
  const inner = out.replace(/^<>\n?/, "").replace(/\n?<\/>;?\s*$/, "");
  return dedent(inner);
}

/**
 * oxfmt returns malformed input *unchanged* with parse errors in `errors`
 * rather than throwing; unchecked, an invalid fence crashes far from its
 * source with no MDX line. Report at the directive node with oxfmt's codeframe.
 *
 * @param {{ errors?: Array<{ severity?: string, message?: string, codeframe?: string }> }} result
 * @param {import("@astrojs/markdown-satteri").MdastVisitorContext} ctx
 * @param {any} node
 * @param {string} lang
 */
function failOnFormatErrors(result, ctx, node, lang) {
  const errors = (result.errors ?? []).filter(
    (e) => String(e.severity ?? "error").toLowerCase() === "error",
  );
  if (errors.length === 0) return;
  const first = errors[0];
  const detail = first.codeframe ? `\n${first.codeframe}` : "";
  ctx.report({
    message: `malformed \`${lang}\` fence in \`:::example\`: ${first.message ?? "syntax error"}${detail}`,
    node,
    severity: "error",
  });
}
