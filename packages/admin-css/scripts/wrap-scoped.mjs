#!/usr/bin/env node
/**
 * Wrap the built admin CSS in `@scope (._ao-admin-root) { ... }` and prefix
 * every admin class selector with `_ao-` so the bundle can drop into a
 * non-admin host page without colliding on common class names.
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
 * - Every class selector inside the scope is prefixed: `.btn` becomes
 *   `._ao-btn`, `.card-body` becomes `._ao-card-body`, and so on. Admin's
 *   classes can no longer collide with the host page's classes, so the
 *   bundle does not need a defensive `all: revert-layer` reset.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, "../dist");

const PREFIX = "_ao-";
const SCOPE_ROOT = `.${PREFIX}admin-root`;

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

// Use a real selector parser so we only touch `class` nodes — attribute
// values (`[href*=".com"]`), escaped class names (`.md\:flex`, `.\32 xl\:flex`)
// and pseudo-classes are all handled correctly without regex acrobatics.
const prefixClassesProcessor = selectorParser((root) => {
  root.walkClasses((node) => {
    node.value = `${PREFIX}${node.value}`;
  });
});

function prefixClassesInSelector(selector) {
  return prefixClassesProcessor.processSync(selector);
}

function rewriteSelectorsDeep(container) {
  container.walkRules((rule) => {
    rule.selector = prefixClassesInSelector(rewriteSelector(rule.selector));
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

  const scope = postcss.atRule({ name: "scope", params: `(${SCOPE_ROOT})` });
  scope.raws.before = "\n\n";
  scope.raws.between = " ";
  scope.raws.afterName = " ";
  scope.raws.after = "\n";
  wrapped.forEach((node, i) => {
    node.raws.before = i === 0 ? "\n" : "\n";
    scope.append(node);
  });
  rewriteSelectorsDeep(scope);

  hoisted.forEach((node, i) => {
    node.raws.before = i === 0 ? "" : "\n";
    root.append(node);
  });
  root.append(scope);

  const banner = `/*! @aortl/admin-css scoped variant — @scope (${SCOPE_ROOT}); admin classes prefixed with ${PREFIX}. */\n`;
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
