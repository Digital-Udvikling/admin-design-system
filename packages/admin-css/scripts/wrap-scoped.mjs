#!/usr/bin/env node
/**
 * Build the scoped variant of admin.css: every rule wrapped in
 * `@scope (._ao-admin-root)`, admin class names prefixed `_ao-` so they can't
 * collide with host classes. Globals that can't be scoped (`@property`,
 * `@font-face`, `@keyframes`, `@charset`, `@import`) are hoisted above the
 * scope. `@layer` is dropped and blocks are flattened in declared order —
 * layered rules always lose to unlayered host rules of any specificity, so
 * the bundle ships unlayered. Cascade invariants are locked in by
 * `wrap-scoped.test.mjs`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import postcss from "postcss";
import postcssNesting from "postcss-nesting";
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
  // Split on top-level commas via the AST — a naive `split(",")` corrupts
  // commas inside quoted attribute values (`[data-x="1,2"]`) and `:is(.a, .b)`.
  const root = selectorParser().astSync(selector);
  const seen = new Set();
  const out = [];
  for (const sel of root.nodes) {
    const trimmed = sel.toString().trim();
    const rewritten = SELECTOR_REWRITES.get(trimmed) ?? trimmed;
    if (seen.has(rewritten)) continue;
    seen.add(rewritten);
    out.push(rewritten);
  }
  return out.join(", ");
}

// Only touch `class` nodes — attribute values, escaped class names
// (`.md\:flex`, `.\32 xl\:flex`) and pseudo-classes stay intact.
const prefixClassesProcessor = selectorParser((root) => {
  root.walkClasses((node) => {
    node.value = `${PREFIX}${node.value}`;
  });
});

function prefixClassesInSelector(selector) {
  return prefixClassesProcessor.processSync(selector);
}

// `&` selectors inherit the parent's bump through expansion; bumping them
// would stack `:scope` redundantly — or emit `:scope :scope <parent>:hover`,
// which matches nothing.
function selectorHasNesting(selector) {
  let found = false;
  selector.walk((node) => {
    if (node.type === "nesting") found = true;
  });
  return found;
}

function selectorReferencesScope(selector) {
  let found = false;
  selector.walk((node) => {
    if (node.type === "pseudo" && node.value === ":scope") found = true;
  });
  return found;
}

function classifyFirstNode(selector) {
  const first = selector.nodes.find((n) => n.type !== "combinator");
  if (!first) return null;
  if (first.type === "tag") return "tag";
  if (first.type === "universal") return "universal";
  if (first.type === "attribute") return "attribute";
  if (first.type === "class") return "class";
  if (first.type === "id") return "id";
  if (first.type === "pseudo") {
    return first.value.startsWith("::") ? "pseudo-element" : "pseudo-class";
  }
  return null;
}

// Prepend `:scope` to every selector. With layers flattened, the bundle
// competes with host rules purely on specificity, and an unbumped
// `._ao-card-title` (0,1,0) would lose its `font-size` to admin's own bumped
// reset `:scope h3` (0,1,1). Bumping preserves the ordering Tailwind's layers
// used to provide and keeps admin ahead of unlayered host rules of the same
// shape. Selectors already referencing `:scope` and `&`-nested ones are left
// alone. First compounds that could match the scope root emit both a compound
// and a descendant form, so `<AdminRoot className="grid">` still picks up
// `._ao-grid`.
function bumpSpecificity(selectorList) {
  const root = selectorParser().astSync(selectorList);
  const out = [];

  for (const sel of root.nodes) {
    const original = sel.toString().trim();

    if (selectorReferencesScope(sel) || selectorHasNesting(sel)) {
      out.push(original);
      continue;
    }

    const cls = classifyFirstNode(sel);

    switch (cls) {
      case "tag":
        // The scope root is a div, so a type selector can't match it.
        out.push(`:scope ${original}`);
        break;
      case "universal": {
        // Drop the leading `*` for the compound form; the rest stays verbatim.
        const firstCombinatorIdx = sel.nodes.findIndex((n) => n.type === "combinator");
        const firstCompoundEnd = firstCombinatorIdx === -1 ? sel.nodes.length : firstCombinatorIdx;
        const firstCompound = sel.nodes.slice(0, firstCompoundEnd);
        const universalIdx = firstCompound.findIndex((n) => n.type === "universal");
        const compoundRest = firstCompound
          .filter((_, i) => i !== universalIdx)
          .map((n) => n.toString())
          .join("");
        const tail = sel.nodes
          .slice(firstCompoundEnd)
          .map((n) => n.toString())
          .join("");
        out.push(`:scope${compoundRest}${tail}`);
        out.push(`:scope ${original}`);
        break;
      }
      case "class":
      case "id":
      case "pseudo-element":
      case "pseudo-class":
      case "attribute":
        out.push(`:scope${original}`);
        out.push(`:scope ${original}`);
        break;
      default:
        out.push(`:scope ${original}`);
    }
  }

  return out.join(", ");
}

// Keyframe steps (`from`/`to`/`0%`) aren't selectors — `:scope to` is invalid
// CSS. Tailwind nests `@keyframes` inside `@layer components`, so the hoist
// pass misses them; skip rule-walking under any keyframes ancestor instead.
function isInsideKeyframes(rule) {
  for (let p = rule.parent; p; p = p.parent) {
    if (p.type === "atrule" && /(?:^|-)keyframes$/.test(p.name)) return true;
  }
  return false;
}

function rewriteSelectorsDeep(container) {
  container.walkRules((rule) => {
    if (isInsideKeyframes(rule)) return;
    rule.selector = bumpSpecificity(prefixClassesInSelector(rewriteSelector(rule.selector)));
  });
}

function isLayerStatement(node) {
  return (
    node.type === "atrule" &&
    node.name === "layer" &&
    (node.nodes === undefined || node.nodes === null)
  );
}

function collectDeclaredLayerOrder(container) {
  const order = [];
  const seen = new Set();
  container.walkAtRules("layer", (rule) => {
    if (!isLayerStatement(rule)) return;
    for (const name of rule.params
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)) {
      if (seen.has(name)) continue;
      seen.add(name);
      order.push(name);
    }
  });
  return order;
}

function flattenLayersInScope(scope, layerOrder) {
  const buckets = new Map(layerOrder.map((name) => [name, []]));
  const unknown = [];

  for (const child of scope.nodes.slice()) {
    if (child.type !== "atrule" || child.name !== "layer" || !child.nodes) continue;
    const name = child.params.trim();
    const target = buckets.get(name) ?? unknown;
    target.push(...child.nodes);
    child.remove();
  }

  const emit = (node, isFirst) => {
    node.raws.before = isFirst ? "\n" : "\n";
    scope.append(node);
  };

  let first = true;
  for (const name of layerOrder) {
    for (const node of buckets.get(name) ?? []) {
      emit(node, first);
      first = false;
    }
  }
  for (const node of unknown) {
    emit(node, first);
    first = false;
  }
}

// Prepended as the scope's first rule: reclaims typography on the bare
// element selectors hosts most commonly style. `:where()` pins specificity
// at (0,1,0) however many tags are listed — admin's bumped class rules
// (0,2,0) and a consumer's later-loaded class (0,1,0) still win, a bare host
// `h3 { font-family }` (0,0,1) loses, and `.page h3` (0,1,1) beats the reset
// as an intentional escape hatch. Inherited properties resolve from `:scope`,
// which carries admin's typography; `normal`/`none` are the initial values
// of the two non-inherited ones.
const BARE_ELEMENT_RESET = `
:scope :where(
  h1, h2, h3, h4, h5, h6,
  p, a,
  ul, ol, li, dl, dt, dd,
  blockquote, pre, code,
  button, input, textarea, select, label, fieldset, legend,
  table, thead, tbody, tfoot, tr, th, td
) {
  font-family: inherit;
  font-style: inherit;
  font-variant: normal;
  font-weight: inherit;
  color: inherit;
  letter-spacing: normal;
  text-transform: none;
  text-decoration: inherit;
  line-height: inherit;
}
`;

function prependBareElementReset(scope) {
  scope.prepend(postcss.parse(BARE_ELEMENT_RESET));
}

function shouldHoist(node) {
  if (node.type === "comment") return true;
  if (node.type !== "atrule") return false;
  if (HOIST_ATRULES.has(node.name)) return true;
  return false;
}

export function wrap(css) {
  // Flatten native CSS nesting first, while selectors are still plain class
  // names and there's no @scope yet. The scoped bundle is embedded into host
  // apps that re-process it through their own build, and some toolchains
  // (notably LightningCSS) mis-lower a nested `&` *inside* @scope to a bare
  // `:scope` — silently rewriting `._ao-btn:hover` to `:scope:hover` and
  // breaking every hover/focus/state rule. De-nesting here ships the bundle
  // pre-flattened so no consumer ever has to downlevel it; it's trivial and
  // correct at this point because the @scope context doesn't exist yet.
  const flattened = postcss([postcssNesting]).process(css, { from: undefined }).css;
  const root = postcss.parse(flattened);

  // Capture layer order before stripping the statements, which would
  // otherwise declare Tailwind's layer order document-wide in the consumer's
  // document.
  const layerOrder = collectDeclaredLayerOrder(root);

  const hoisted = [];
  const wrapped = [];
  while (root.first) {
    const node = root.first;
    node.remove();
    if (isLayerStatement(node)) continue;
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
  flattenLayersInScope(scope, layerOrder);
  prependBareElementReset(scope);

  hoisted.forEach((node, i) => {
    node.raws.before = i === 0 ? "" : "\n";
    root.append(node);
  });
  root.append(scope);

  const banner = `/*! @aortl/admin-css scoped variant — @scope (${SCOPE_ROOT}); admin classes prefixed with ${PREFIX}. */\n`;
  return banner + root.toString();
}

async function wrapFile(inputPath, outputPath) {
  const css = await readFile(inputPath, "utf8");
  await writeFile(outputPath, wrap(css));
}

const isCLI = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCLI) {
  const targets = [
    ["admin.css", "admin.scoped.css"],
    ["admin.min.css", "admin.scoped.min.css"],
  ];

  for (const [input, output] of targets) {
    await wrapFile(resolve(DIST, input), resolve(DIST, output));
    console.log(`wrap-scoped: dist/${input} → dist/${output}`);
  }
}
