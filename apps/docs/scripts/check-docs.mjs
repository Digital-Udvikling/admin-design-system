#!/usr/bin/env node
// Validate the docs site against itself and against the CSS source:
//   1. every relative/BASE_URL link points at a page that exists
//   2. every `#anchor` on such a link exists in the built HTML
//   3. every class and custom property named in a `## Reference` → `### Vanilla`
//      table is defined in packages/admin-css/src/components/
//   4. coverage report: component classes no Reference table mentions yet
//
// Checks 1 and 3 need no build. Check 2 reads apps/docs/dist, so it is skipped
// with a warning unless --require-build is passed (CI builds first, so it does).
// Check 4 only reports unless --strict-coverage is passed; flip that on once
// every component page carries a Reference section.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(SCRIPT_DIR, "..", "src", "content", "docs");
const PAGES_DIR = join(SCRIPT_DIR, "..", "src", "pages");
const DIST_DIR = join(SCRIPT_DIR, "..", "dist");
const REPO_ROOT = join(SCRIPT_DIR, "..", "..", "..");
const CSS_DIR = join(REPO_ROOT, "packages", "admin-css", "src", "components");

const requireBuild = process.argv.includes("--require-build");
const strictCoverage = process.argv.includes("--strict-coverage");

const errors = [];
const warnings = [];

function walk(dir, ext) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, ext));
    else if (entry.endsWith(ext)) out.push(full);
  }
  return out;
}

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
    if (!ids.has(hash)) errors.push(`${rel}: anchor not found on ${targetUrl}: ${href}`);
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
