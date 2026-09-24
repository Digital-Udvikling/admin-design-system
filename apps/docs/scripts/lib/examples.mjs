// Docs pages and their `:::example` directives, parsed the way the site sees them.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  buildPreviewSource,
  collectFences,
  forwardedImports,
} from "../../plugins/example/index.mjs";

export const DOCS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "src",
  "content",
  "docs",
);

// The MDX integration's own Sätteri, so directives and fences parse exactly as
// the site sees them (a `:::example` shown inside a ````markdown fence is not one).
const requireFromMdx = createRequire(createRequire(import.meta.url).resolve("@astrojs/mdx"));
const { mdxToMdast } = await import(pathToFileURL(requireFromMdx.resolve("satteri")).href);

// Mirrors `markdown.processor` in astro.config.mjs; frontmatter keeps line numbers exact.
const MDAST_FEATURES = { directive: true, gfm: true, frontmatter: true };

/**
 * Files under `dir` ending in `ext`, recursively, in sorted order.
 *
 * @param {string} dir
 * @param {string} ext
 * @returns {string[]}
 */
export function walk(dir, ext) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, ext));
    else if (entry.endsWith(ext)) out.push(full);
  }
  return out;
}

/**
 * Calls `fn` on `node` and its descendants in document order.
 *
 * @param {any} node
 * @param {(node: any) => void} fn
 */
export function visit(node, fn) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}

/**
 * Every docs MDX page parsed to mdast. A page that fails to parse lands in
 * `errors` and is left out of `pages`.
 *
 * @returns {{ pages: { abs: string; rel: string; tree: any }[]; errors: string[] }}
 */
export function loadPages() {
  const pages = [];
  const errors = [];
  for (const abs of walk(DOCS_DIR, ".mdx")) {
    const rel = relative(DOCS_DIR, abs).replaceAll("\\", "/");
    try {
      pages.push({
        abs,
        rel,
        tree: mdxToMdast(readFileSync(abs, "utf8"), { features: MDAST_FEATURES }),
      });
    } catch (e) {
      errors.push(`${rel}: MDX parse error: ${e instanceof Error ? e.message : e}`);
    }
  }
  return { pages, errors };
}

/**
 * @typedef {object} Example
 * @property {string} abs      Absolute path of the MDX page.
 * @property {string} rel      Page path relative to the docs content dir (`components/buttons.mdx`).
 * @property {number} index    0-based position among the page's examples.
 * @property {number} line     1-based MDX line of the `:::example` opener.
 * @property {number} endLine  1-based MDX line of the closing `:::`.
 * @property {{ value: string; line: number } | undefined} html  First `html` fence; `line` is its opening fence.
 * @property {{ value: string; line: number } | undefined} tsx   First `tsx`/`jsx` fence; `line` is its opening fence.
 * @property {{ code: string; mdxLine: number }[]} imports  MDX imports above the example, as forwarded into its preview.
 */

/**
 * Every `:::example` on `pages`, in document order. Each sees the MDX imports
 * above it, the same accumulation as the remark plugin.
 *
 * @param {{ abs: string; rel: string; tree: any }[]} pages
 * @returns {Example[]}
 */
export function collectExamples(pages) {
  const out = [];
  for (const { abs, rel, tree } of pages) {
    const imports = [];
    let index = 0;
    visit(tree, (node) => {
      if (node.type === "mdxjsEsm") {
        for (const { code, line } of forwardedImports(node.value)) {
          imports.push({ code, mdxLine: node.position.start.line + line - 1 });
        }
      }
      if (node.type !== "containerDirective" || node.name !== "example") return;
      const { html, tsx } = collectFences(node.children ?? []);
      const fence = (f) => f && { value: f.value, line: f.position.start.line };
      out.push({
        abs,
        rel,
        index: index++,
        line: node.position.start.line,
        endLine: node.position.end.line,
        html: fence(html),
        tsx: fence(tsx),
        imports: [...imports],
      });
    });
  }
  return out;
}

/**
 * TSX source of the example's preview module, as the site builds it: the
 * forwarded imports plus the fence, wrapped in `<AdminRoot>`. Default-exports
 * the preview component. Null when the example has no tsx fence.
 *
 * @param {Example} example
 * @returns {string | null}
 */
export function previewSource(example) {
  if (example.tsx === undefined) return null;
  return buildPreviewSource(example.imports.map((i) => i.code).join("\n"), example.tsx.value);
}

/**
 * Examples selected by `ref`: `page.mdx` (all of them), `page.mdx:LINE` (the one
 * whose directive spans LINE), or `page.mdx#N` (the Nth, 0-based). The page may
 * omit `.mdx` and may be given relative to the docs content dir or as a path.
 * Throws when nothing matches.
 *
 * @param {Example[]} examples
 * @param {string} ref
 * @returns {Example[]}
 */
export function selectExamples(examples, ref) {
  const m = /^(.*?)(?::(\d+)|#(\d+))?$/.exec(ref);
  const page = (m?.[1] ?? ref)
    .replace(/^.*src\/content\/docs\//, "")
    .replace(/(?<!\.mdx)$/, ".mdx");
  const onPage = examples.filter((e) => e.rel === page);
  if (onPage.length === 0) throw new Error(`no examples on ${page}`);
  if (m?.[2] !== undefined) {
    const line = Number(m[2]);
    const hit = onPage.filter((e) => e.line <= line && line <= e.endLine);
    if (hit.length === 0) throw new Error(`no example spans ${page}:${line}`);
    return hit;
  }
  if (m?.[3] !== undefined) {
    const hit = onPage[Number(m[3])];
    if (hit === undefined)
      throw new Error(`${page} has ${onPage.length} examples; #${m[3]} is out of range`);
    return [hit];
  }
  return onPage;
}
