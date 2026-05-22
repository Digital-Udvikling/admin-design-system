#!/usr/bin/env node
/**
 * Wrap the built admin CSS in `@scope (.admin-root) { ... }` so consumers can
 * embed admin components inside non-admin host pages without polluting the
 * global namespace.
 *
 * - Globals stay at top level: @property registrations, @font-face,
 *   @keyframes, @charset, @import, statement-form @layer declarations
 *   (e.g. `@layer theme, base, components, utilities;`). These are
 *   document-wide by spec and can't be meaningfully scoped.
 * - Everything else (layer blocks, raw rules, :root token defs, [data-theme]
 *   matchers, Tailwind's reset `*` block) is wrapped in a single @scope.
 * - Inside the scope, `:root`, `html`, and `body` selectors are rewritten
 *   to `:scope` so tokens and resets land on the wrapper, not the document.
 *   `:host` selectors are preserved (harmless when no shadow root exists).
 * - A `:scope, :scope * { all: revert-layer }` rule is prepended inside the
 *   scope so unlayered host-page rules (e.g. Bootstrap's `.btn`, `body`
 *   defaults) revert in favour of admin's layered cascade. `revert-layer`
 *   (not `revert`) is critical: it rolls back only the current — unlayered —
 *   layer, leaving admin's own `@layer base/components/utilities` rules to
 *   apply. Plain `revert` would clobber admin too.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, "../dist");

const HOIST_ATRULES = new Set([
  "property",
  "font-face",
  "keyframes",
  "-webkit-keyframes",
  "-moz-keyframes",
  "charset",
  "import",
]);

const SELECTOR_REWRITES = new Map([
  [":root", ":scope"],
  ["html", ":scope"],
  ["body", ":scope"],
]);

function rewriteSelector(selector) {
  const parts = selector.split(",").map((p) => {
    const trimmed = p.trim();
    return SELECTOR_REWRITES.get(trimmed) ?? trimmed;
  });
  const seen = new Set();
  const deduped = [];
  for (const part of parts) {
    if (seen.has(part)) continue;
    seen.add(part);
    deduped.push(part);
  }
  return deduped.join(", ");
}

function rewriteSelectorsDeep(container) {
  container.walkRules((rule) => {
    rule.selector = rewriteSelector(rule.selector);
  });
}

function isLayerStatement(node) {
  return (
    node.type === "atrule" &&
    node.name === "layer" &&
    (node.nodes === undefined || node.nodes === null)
  );
}

function shouldHoist(node) {
  if (node.type === "comment") return true;
  if (node.type !== "atrule") return false;
  if (HOIST_ATRULES.has(node.name)) return true;
  if (isLayerStatement(node)) return true;
  return false;
}

async function wrapFile(inputPath, outputPath) {
  const css = await readFile(inputPath, "utf8");
  const root = postcss.parse(css);

  const hoisted = [];
  const wrapped = [];
  while (root.first) {
    const node = root.first;
    node.remove();
    if (shouldHoist(node)) {
      hoisted.push(node);
    } else {
      wrapped.push(node);
    }
  }

  const scope = postcss.atRule({ name: "scope", params: "(.admin-root)" });
  scope.raws.before = "\n\n";
  scope.raws.between = " ";
  scope.raws.afterName = " ";
  scope.raws.after = "\n";
  wrapped.forEach((node, i) => {
    node.raws.before = i === 0 ? "\n" : "\n";
    scope.append(node);
  });
  rewriteSelectorsDeep(scope);

  const isoReset = postcss.rule({ selector: ":scope, :scope *" });
  isoReset.append(postcss.decl({ prop: "all", value: "revert-layer" }));
  isoReset.raws.before = "\n  ";
  isoReset.raws.between = " ";
  scope.prepend(isoReset);

  hoisted.forEach((node, i) => {
    node.raws.before = i === 0 ? "" : "\n";
    root.append(node);
  });
  root.append(scope);

  const banner = "/*! @aortl/admin-css scoped variant — wrapped in @scope (.admin-root). */\n";
  const output = banner + root.toString();
  await writeFile(outputPath, output);
}

const targets = [
  ["admin.css", "admin.scoped.css"],
  ["admin.min.css", "admin.scoped.min.css"],
];

for (const [input, output] of targets) {
  await wrapFile(resolve(DIST, input), resolve(DIST, output));
  console.log(`wrap-scoped: dist/${input} → dist/${output}`);
}
