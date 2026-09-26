#!/usr/bin/env node
// Validate the docs site against itself, the CSS source, and the React source:
//   1. every relative/BASE_URL link points at a page that exists
//   2. every `#anchor` on such a link exists in the built HTML
//   3. every class and custom property named in a `## Reference` → `### Vanilla`
//      table is defined in packages/admin-css/src/components/
//   4. coverage report: component classes no Reference table mentions yet
//   5. every `:::example` tsx fence type-checks, built into the same preview
//      module the site renders, against packages/admin-react/src
//   6. every prop in a `## Reference` → `### React` table exists on the props
//      type of its part (or, without a Part column, of a component the page imports)
//   7. every example with both fences uses the same admin classes in each: the
//      tsx fence is server-rendered and compared against the html fence
//
// All but check 2 read source only. Check 2 reads apps/docs/dist, which may be
// missing or stale, so its problems are warnings unless --require-build is passed
// (CI builds first, so it does).
// Check 4 only reports unless --strict-coverage is passed; flip that on once
// every component page carries a Reference section.

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Window } from "happy-dom";
import ts from "typescript";
import { buildPreviewSource, forwardedImports } from "../plugins/example/index.mjs";
import { bundle } from "./lib/bundle.mjs";
import {
  DOCS_DIR,
  collectExamples,
  loadPages,
  previewSource,
  visit,
  walk,
} from "./lib/examples.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(SCRIPT_DIR, "..", "src", "pages");
const DIST_DIR = join(SCRIPT_DIR, "..", "dist");
const REPO_ROOT = join(SCRIPT_DIR, "..", "..", "..");
const CSS_DIR = join(REPO_ROOT, "packages", "admin-css", "src", "components");
const REACT_ENTRY = join(REPO_ROOT, "packages", "admin-react", "src", "index.ts");

const requireBuild = process.argv.includes("--require-build");
const strictCoverage = process.argv.includes("--strict-coverage");

const errors = [];
const warnings = [];

// Starlight serves directory-style URLs: `a/index.mdx` → `/a/`, `a/b.mdx` → `/a/b/`.
function urlForDocsRel(rel) {
  const slug = rel.replace(/\.mdx$/, "").replace(/\/index$/, "");
  return slug === "index" || slug === "" ? "/" : `/${slug}/`;
}

const mdxFiles = walk(DOCS_DIR, ".mdx");
const knownUrls = new Set(
  mdxFiles.map((abs) => urlForDocsRel(relative(DOCS_DIR, abs).replaceAll("\\", "/"))),
);
// Standalone Astro routes (e.g. the changelog) are link targets too.
if (existsSync(PAGES_DIR)) {
  for (const abs of walk(PAGES_DIR, ".astro")) {
    const rel = relative(PAGES_DIR, abs)
      .replaceAll("\\", "/")
      .replace(/\.astro$/, "");
    knownUrls.add(rel === "index" ? "/" : `/${rel}/`);
  }
}

// ---------------------------------------------------------------- links

/** `[text](href)` where href is relative, plus href={`${BASE_URL}path`} forms. */
function extractLinks(src) {
  const out = [];
  for (const m of src.matchAll(/\]\((\.\.?\/[^)\s]+|#[^)\s]+)\)/g)) out.push(m[1]);
  for (const m of src.matchAll(/\$\{import\.meta\.env\.BASE_URL\}([^`}"'\s]*)/g)) {
    out.push(`/${m[1]}`);
  }
  return out;
}

const anchorsToCheck = [];

for (const abs of mdxFiles) {
  const rel = relative(DOCS_DIR, abs).replaceAll("\\", "/");
  const pageUrl = urlForDocsRel(rel);
  const src = readFileSync(abs, "utf8");

  for (const href of extractLinks(src)) {
    const url = new URL(href, `https://docs${pageUrl}`);
    // Asset references (`/favicon.svg`) are not pages — a dotted last segment.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) continue;
    const targetUrl = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    if (!knownUrls.has(targetUrl)) {
      errors.push(`${rel}: link target does not exist: ${href} → ${targetUrl}`);
      continue;
    }
    if (url.hash) anchorsToCheck.push({ rel, href, targetUrl, hash: url.hash.slice(1) });
  }
}

// ---------------------------------------------------------------- anchors

if (!existsSync(DIST_DIR)) {
  const msg = `apps/docs/dist missing — ${anchorsToCheck.length} anchors unverified. Run 'pnpm build' first.`;
  if (requireBuild) errors.push(msg);
  else warnings.push(msg);
} else {
  const idCache = new Map();
  const idsFor = (targetUrl) => {
    if (idCache.has(targetUrl)) return idCache.get(targetUrl);
    const htmlPath = join(DIST_DIR, targetUrl.replace(/^\/|\/$/g, ""), "index.html");
    let ids = null;
    if (existsSync(htmlPath)) {
      ids = new Set();
      const html = readFileSync(htmlPath, "utf8");
      for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
    }
    idCache.set(targetUrl, ids);
    return ids;
  };

  for (const { rel, href, targetUrl, hash } of anchorsToCheck) {
    const ids = idsFor(targetUrl);
    if (ids === null) {
      warnings.push(`${rel}: no built HTML for ${targetUrl}, anchor '${hash}' unverified`);
      continue;
    }
    if (ids.has(hash)) continue;
    if (requireBuild) errors.push(`${rel}: anchor not found on ${targetUrl}: ${href}`);
    else warnings.push(`${rel}: anchor not found on ${targetUrl}: ${href} (dist may be stale)`);
  }
}

// ---------------------------------------------------------------- classes

/** Classes and custom properties defined in the component CSS source. */
function cssDefinitions() {
  const classes = new Set();
  const vars = new Set();
  for (const abs of walk(CSS_DIR, ".css")) {
    const src = readFileSync(abs, "utf8")
      // Prose in comments ("e.g.") and hostnames in data URIs ("www.w3.org") both
      // look like class selectors to the scan below.
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/url\((?:[^()]|\([^()]*\))*\)/g, "url()");
    // Selectors only — `@apply` bodies reference Tailwind utilities, not our classes.
    for (const line of src.split("\n")) {
      // `@import "./card.css"` is a file path, not a selector.
      if (/^\s*@import\b/.test(line)) continue;
      // `@apply` bodies reference Tailwind utilities, not our classes — but they
      // can still read our custom properties (`min-w-[var(--anchor-width)]`).
      if (!/^\s*@apply\b/.test(line)) {
        // camelCase is allowed: `.asteriskField` is a template-generator hook.
        for (const m of line.matchAll(/\.([a-zA-Z][a-zA-Z0-9-]*)/g)) classes.add(m[1]);
        for (const m of line.matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)) vars.add(m[1]);
      }
      for (const m of line.matchAll(/var\((--[a-z][a-z0-9-]*)/g)) vars.add(m[1]);
    }
  }
  return { classes, vars };
}

/** First-column tokens of the `### Vanilla` table inside `## Reference`. */
function referenceVanillaTokens(src) {
  const lines = src.split("\n");
  const tokens = [];
  let inReference = false;
  let inVanilla = false;
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      inReference = /^##\s+Reference\s*$/.test(line);
      inVanilla = false;
      continue;
    }
    if (!inReference) continue;
    if (/^###\s+/.test(line)) {
      inVanilla = /^###\s+Vanilla\b/.test(line);
      continue;
    }
    if (!inVanilla || !/^\s*\|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1);
    const first = cells[0];
    if (first === undefined || /^\s*:?-+:?\s*$/.test(first)) continue;
    for (const m of first.matchAll(/`([^`]+)`/g)) {
      const raw = m[1].trim();
      // Attributes are written `[data-selected]`; anything bracketed or with
      // punctuation is markup, not a class token.
      if (/[^a-zA-Z0-9-]/.test(raw.replace(/^--/, ""))) continue;
      if (/^(data|aria)-/.test(raw)) continue;
      tokens.push(raw);
    }
  }
  return tokens;
}

const { classes: cssClasses, vars: cssVars } = cssDefinitions();
const documented = new Set();
let pagesWithReference = 0;

for (const abs of mdxFiles) {
  const rel = relative(DOCS_DIR, abs).replaceAll("\\", "/");
  const src = readFileSync(abs, "utf8");
  const tokens = referenceVanillaTokens(src);
  if (tokens.length > 0) pagesWithReference += 1;
  for (const token of tokens) {
    if (token.startsWith("--")) {
      if (!cssVars.has(token)) {
        errors.push(`${rel}: Reference names custom property ${token}, not found in component CSS`);
      }
      continue;
    }
    documented.add(token);
    if (!cssClasses.has(token)) {
      errors.push(`${rel}: Reference names class .${token}, not found in component CSS`);
    }
  }
}

// ---------------------------------------------------------------- mdast

/** Concatenated `text` / `inlineCode` content under a node. */
function textOf(node) {
  if (node.type === "text" || node.type === "inlineCode") return node.value;
  return (node.children ?? []).map(textOf).join("");
}

/** Every `inlineCode` value under a node. */
function codeSpans(node) {
  const out = [];
  visit(node, (n) => n.type === "inlineCode" && out.push(n.value));
  return out;
}

// A page that doesn't parse is reported and left out of checks 5 to 7.
const { pages, errors: parseErrors } = loadPages();
errors.push(...parseErrors);
const examples = collectExamples(pages);

// ---------------------------------------------------------------- react

// One program covers both React checks; the checker is shared.
const tsStart = performance.now();

// Marker lines locate the forwarded imports and the fence body inside the
// generated module, so MDX lines stay right whatever buildPreviewSource wraps
// around them.
const IMPORTS_MARKER = "__CHECK_DOCS_IMPORTS__";
const BODY_MARKER = "__CHECK_DOCS_BODY__";
const markerLine = (source, marker) => source.split("\n").findIndex((l) => l.includes(marker));
const importsLine = markerLine(buildPreviewSource(`// ${IMPORTS_MARKER}`, ""), IMPORTS_MARKER);

/** Virtual preview module path → where its fence lives in the MDX. */
const previews = new Map();
for (const example of examples) {
  const { abs, rel, index, tsx, imports } = example;
  if (tsx === undefined) continue;
  const importsBlock = imports.map((i) => i.code).join("\n");
  // Beside the page, so relative imports resolve as they do from the MDX.
  const file = join(dirname(abs), `__example_${basename(abs, ".mdx")}_${index}.tsx`);
  previews.set(file, {
    rel,
    source: previewSource(example),
    // Module line (offset from importsLine) → MDX line of the import it belongs to.
    importLines: imports.flatMap((i) => i.code.split("\n").map(() => i.mdxLine)),
    bodyLine: markerLine(buildPreviewSource(importsBlock, BODY_MARKER), BODY_MARKER),
    bodyLength: tsx.value.split("\n").length,
    fenceLine: tsx.line,
    directiveLine: example.line,
  });
}

const tsconfigPath = join(SCRIPT_DIR, "..", "tsconfig.json");
const tsconfig = ts.getParsedCommandLineOfConfigFile(tsconfigPath, undefined, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic: (d) => {
    throw new Error(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
  },
});
const compilerOptions = {
  ...tsconfig.options,
  noEmit: true,
  // What the generated `.astro/types.d.ts` references (it needs `astro sync`):
  // `import.meta.env`, `*.astro` modules.
  types: ["astro/client"],
  // Source, like the docs' Vite alias; dist is often stale.
  paths: { "@aortl/admin-react": [REACT_ENTRY] },
};

const host = ts.createCompilerHost(compilerOptions);
const { getSourceFile, fileExists, readFile } = host;
host.getSourceFile = (file, lang, ...rest) =>
  previews.has(file)
    ? ts.createSourceFile(file, previews.get(file).source, lang, true, ts.ScriptKind.TSX)
    : getSourceFile.call(host, file, lang, ...rest);
host.fileExists = (file) => previews.has(file) || fileExists.call(host, file);
host.readFile = (file) => previews.get(file)?.source ?? readFile.call(host, file);

const program = ts.createProgram({
  rootNames: [...previews.keys(), REACT_ENTRY],
  options: compilerOptions,
  host,
});

const flatten = (d) => ts.flattenDiagnosticMessageText(d.messageText, " ").replace(/\s+/g, " ");

for (const d of [...program.getOptionsDiagnostics(), ...program.getGlobalDiagnostics()]) {
  errors.push(`examples: TS${d.code} ${flatten(d)}`);
}

const exampleErrors = new Set();
for (const [file, preview] of previews) {
  const sourceFile = program.getSourceFile(file);
  const diagnostics = [
    ...program.getSyntacticDiagnostics(sourceFile),
    ...program.getSemanticDiagnostics(sourceFile),
  ];
  for (const d of diagnostics) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(d.start ?? 0);
    const offset = line - preview.bodyLine;
    // Neither body nor a forwarded import means the wrapper; point at the directive.
    const mdxLine =
      offset >= 0 && offset < preview.bodyLength
        ? preview.fenceLine + 1 + offset
        : (preview.importLines[line - importsLine] ?? preview.directiveLine);
    // A bad import fails every example below it; its shared MDX line dedupes them.
    exampleErrors.add(`${preview.rel}:${mdxLine} TS${d.code} ${flatten(d)}`);
  }
}
errors.push(...exampleErrors);

const checker = program.getTypeChecker();
const reactExports = new Map(
  checker
    .getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(REACT_ENTRY)))
    .map((s) => [s.name, s]),
);

const propsCache = new Map();
/** Prop names of an exported component or compound part (`Navbar.Brand`), or null. */
function propsOf(part) {
  if (propsCache.has(part)) return propsCache.get(part);
  const [head, ...path] = part.split(".");
  let symbol = reactExports.get(head);
  let props = null;
  if (symbol) {
    if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    let type = checker.getTypeOfSymbol(symbol);
    for (const segment of path) {
      const member = type?.getProperty(segment);
      type = member ? checker.getTypeOfSymbol(member) : undefined;
    }
    const param = type?.getCallSignatures()[0]?.parameters[0];
    if (param) {
      const propsType = checker.getTypeOfSymbol(param);
      // A union's own properties are only those common to every branch.
      const branches = propsType.isUnion() ? propsType.types : [propsType];
      props = new Set(branches.flatMap((t) => checker.getPropertiesOfType(t)).map((p) => p.name));
    }
  }
  propsCache.set(part, props);
  return props;
}

let reactRows = 0;
for (const { rel, tree } of pages) {
  const imported = [];
  let inReference = false;
  let inReact = false;
  for (const node of tree.children) {
    if (node.type === "mdxjsEsm") {
      for (const { code } of forwardedImports(node.value)) {
        const m = code.match(/^import\s*\{([^}]*)\}\s*from\s*"@aortl\/admin-react"/);
        if (!m) continue;
        for (const spec of m[1].split(",")) {
          const name = spec.trim().split(/\s+as\s+/)[0];
          if (name) imported.push(name);
        }
      }
    }
    if (node.type === "heading" && node.depth === 2) {
      inReference = textOf(node).trim() === "Reference";
      inReact = false;
    } else if (node.type === "heading" && node.depth === 3) {
      inReact = inReference && /^React\b/.test(textOf(node).trim());
    }
    if (!inReact || node.type !== "table") continue;

    const [header, ...rows] = node.children;
    const columns = header.children.map((cell) => textOf(cell).trim().toLowerCase());
    const propCol = columns.indexOf("prop");
    if (propCol < 0) continue;
    const partCol = columns.findIndex((c) => c === "part" || c === "component");
    for (const row of rows) {
      const line = row.position.start.line;
      const parts =
        partCol >= 0
          ? codeSpans(row.children[partCol]).map((p) => p.replace(/^<|\s*\/?>$/g, ""))
          : imported;
      const known = parts.filter((p) => propsOf(p) !== null);
      const unknown = parts.filter((p) => propsOf(p) === null);
      if (partCol >= 0) {
        for (const part of unknown) {
          errors.push(`${rel}:${line}: React Reference names ${part}, not a component export`);
        }
      }
      if (known.length === 0) {
        if (partCol < 0 || unknown.length === 0) {
          errors.push(
            `${rel}:${line}: React Reference row has no component to check its props against`,
          );
        }
        continue;
      }
      for (const prop of codeSpans(row.children[propCol])) {
        reactRows += 1;
        if (!known.some((p) => propsOf(p).has(prop))) {
          errors.push(
            `${rel}:${line}: React Reference lists \`${prop}\`, not a prop of ${known.join(" / ")}`,
          );
        }
      }
    }
  }
}

const reactLine =
  `React: ${previews.size} examples type-checked, ${reactRows} Reference props verified ` +
  `(${Math.round(performance.now() - tsStart)} ms).`;

// ---------------------------------------------------------------- parity

// Admin classes one fence uses by design and the other can't or needn't: the
// structure differs but renders alike, or the server render can't show it.
// Every other admin class must appear in both fences of an example or neither.
const REACT_ONLY = new Map([
  ["checkbox-indicator", "Base UI's indicator span; vanilla styles the native input"],
  ["radio-indicator", "Base UI's indicator span; vanilla styles the native input"],
  ["switch-thumb", "Base UI's thumb span; vanilla styles the native input"],
  ["select-icon", "Base UI Select's chevron; vanilla's native <select> draws its own"],
  ["number-input-root", "Base UI NumberField's wrapper"],
  ["table-cell", "explicit cell classes; vanilla matches bare <td> under .table"],
  ["table-header-cell", "explicit cell classes; vanilla matches bare <th> under .table"],
  ["kbd-group", "Kbd wraps every `keys` chord, one key included"],
  ["property-list-copy", "clipboard copy needs JS"],
  ["property-list-copy-icon", "clipboard copy needs JS"],
  ["property-list-copy-icon-copied", "clipboard copy needs JS"],
]);
const VANILLA_ONLY = new Map([
  ["tab-input", "CSS-only tabs switch panels with radio inputs"],
  ["tooltip-wrap", "CSS-only tooltip anchor; React's Tooltip is a Base UI popup"],
  ["tooltip-wrap-end", "CSS-only tooltip anchor"],
  ["tooltip-wrap-bottom", "CSS-only tooltip anchor"],
  ["tooltip-wrap-start", "CSS-only tooltip anchor"],
  ["field-error", "Field.Error renders once validation fails, never on the server"],
  ["asteriskField", "template-generator hook for server-rendered forms"],
]);
// Vanilla subtrees whose React counterpart only mounts on interaction.
const VANILLA_SKIP = ".tooltip";

const parityStart = performance.now();
const pairs = examples.filter((e) => e.html !== undefined && e.tsx !== undefined);
const parityDom = new Window();

/**
 * Admin classes in `markup`, `_ao-` prefix removed. With `react`, also the
 * classes emitted without the prefix, which the scoped bundle leaves unstyled.
 */
function adminClasses(markup, react) {
  const body = new parityDom.DOMParser().parseFromString(markup, "text/html").body;
  if (!react) for (const el of body.querySelectorAll(VANILLA_SKIP)) el.remove();
  const classes = new Set();
  const unprefixed = new Set();
  for (const el of body.querySelectorAll("[class]")) {
    for (const token of el.classList) {
      const name = token.replace(/^_ao-/, "");
      if (name === "admin-root" || !cssClasses.has(name)) continue;
      classes.add(name);
      if (react && name === token) unprefixed.add(name);
    }
  }
  return { classes, unprefixed };
}

let render = null;
try {
  const glue = [
    `import { createElement } from "react";`,
    `import { renderToStaticMarkup } from "react-dom/server";`,
    ...pairs.map((_, i) => `import E${i} from "example:${i}";`),
    `const previews = [${pairs.map((_, i) => `E${i}`).join(", ")}];`,
    `export const render = (i) => renderToStaticMarkup(createElement(previews[i]));`,
  ].join("\n");
  const code = await bundle({
    modules: pairs.map((e) => ({ source: previewSource(e), resolveDir: dirname(e.abs) })),
    glue,
    platform: "node",
  });
  const dir = mkdtempSync(join(tmpdir(), "check-docs-"));
  try {
    writeFileSync(join(dir, "previews.mjs"), code);
    ({ render } = await import(pathToFileURL(join(dir, "previews.mjs")).href));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
} catch (e) {
  errors.push(`parity: previews failed to bundle\n${e instanceof Error ? e.message : e}`);
}

let parityChecked = 0;
if (render !== null) {
  const consoleError = console.error;
  for (const [i, example] of pairs.entries()) {
    const where = `${example.rel}:${example.line}`;
    // React's dev warnings (keys, invalid DOM nesting) surface as console.error.
    const warnings = [];
    console.error = (...args) => warnings.push(args.map(String).join(" "));
    let markup;
    try {
      markup = render(i);
    } catch (e) {
      errors.push(
        `${where}: tsx example throws on server render: ${e instanceof Error ? e.message : e}`,
      );
      continue;
    } finally {
      console.error = consoleError;
    }
    for (const w of warnings) errors.push(`${where}: tsx example warns: ${w.split("\n")[0]}`);
    parityChecked += 1;
    const vanilla = adminClasses(example.html.value, false).classes;
    const react = adminClasses(markup, true);
    const onlyReact = [...react.classes].filter((c) => !vanilla.has(c) && !REACT_ONLY.has(c));
    const onlyVanilla = [...vanilla].filter((c) => !react.classes.has(c) && !VANILLA_ONLY.has(c));
    if (onlyReact.length > 0) {
      errors.push(
        `${where}: tsx renders ${onlyReact.map((c) => `.${c}`).join(" ")}, the html fence doesn't`,
      );
    }
    if (onlyVanilla.length > 0) {
      errors.push(
        `${where}: html fence uses ${onlyVanilla.map((c) => `.${c}`).join(" ")}, the tsx doesn't render it`,
      );
    }
    if (react.unprefixed.size > 0) {
      const names = [...react.unprefixed].map((c) => `.${c}`).join(" ");
      errors.push(
        `${where}: tsx emits ${names} without the _ao- prefix (a raw className); the scoped bundle leaves it unstyled`,
      );
    }
  }
}
const parityLine = `Parity: ${parityChecked}/${pairs.length} vanilla/React example pairs compared (${Math.round(performance.now() - parityStart)} ms).`;

// ---------------------------------------------------------------- coverage

const uncovered = [...cssClasses].filter((c) => !documented.has(c)).sort();
const coverage = cssClasses.size === 0 ? 1 : documented.size / cssClasses.size;
const coverageLine =
  `Reference coverage: ${documented.size}/${cssClasses.size} component classes ` +
  `(${Math.round(coverage * 100)}%) across ${pagesWithReference} pages with a Reference section.`;

if (strictCoverage && uncovered.length > 0) {
  errors.push(`${uncovered.length} component classes documented in no Reference table`);
}

// ---------------------------------------------------------------- report

console.log(coverageLine);
console.log(reactLine);
console.log(parityLine);
if (strictCoverage && uncovered.length > 0) {
  console.log(`Undocumented: ${uncovered.join(", ")}`);
}
for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log("Docs check passed.");
