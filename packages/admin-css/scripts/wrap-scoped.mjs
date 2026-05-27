#!/usr/bin/env node
/**
 * Build the scoped variant of admin.css.
 *
 * Input: the same CSS the unscoped bundle ships, with Tailwind's normal
 * @layer structure. Output: every rule wrapped in `@scope (._ao-admin-root)`,
 * with admin class names prefixed `_ao-` so they can't collide with host
 * classes. Globals that can't be meaningfully scoped (`@property`,
 * `@font-face`, `@keyframes`, `@charset`, `@import`) are hoisted above
 * the scope; `@layer` statements are dropped (the bundle ships unlayered).
 *
 * Within the scope:
 * - `:root` / `html` / `body` are rewritten to `:scope` — `rewriteSelector`.
 * - Class selectors are prefixed `_ao-` — `prefixClassesProcessor`.
 * - `@layer NAME { ... }` blocks are flattened in declared order —
 *   `flattenLayersInScope`. (Layered rules always lose to unlayered host
 *   rules of any specificity, which is why we flatten.)
 * - Every selector's specificity is bumped by prepending `:scope` —
 *   `bumpSpecificity` for the cascade math.
 * - A curated typography reset is prepended as the first rule —
 *   `prependBareElementReset` for the cascade math.
 *
 * Cascade invariants are locked in by `wrap-scoped.test.mjs`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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

// Selectors that reference `&` defer to the parent rule's selector — its
// own bump propagates through expansion. Bumping a nested `&:hover` would
// emit `:scope &:hover`, which expands to `:scope <parent>:hover` and stacks
// `:scope` redundantly (or, when the parent was bumped, becomes
// `:scope :scope <parent>:hover` — the inner `:scope` matches nothing,
// breaking the rule). Tailwind's output rarely has nesting by this stage
// but we guard anyway.
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

// Bump every selector's specificity by prepending `:scope`. Once layer
// wrappers are flattened, the scoped bundle competes with host page rules
// purely on specificity, so an unbumped admin `._ao-card-title` (0,1,0)
// would lose its `font-size` to admin's own bumped base reset
// `:scope h3` (0,1,1) when applied to `<h3 class="_ao-card-title">`. Bumping
// every admin selector preserves the within-admin ordering Tailwind's
// layers used to provide (components beat base, utilities beat components
// by source order) and keeps admin ahead of unlayered host rules of the
// same shape.
//
// Selectors already referencing `:scope` (Tailwind reset rules, our
// `:root`/`html`/`body` rewrites) are left alone, as are `&`-nested
// selectors. First compounds that could match the scope root — classes,
// attributes, pseudo-classes, pseudo-elements, the universal `*` — emit
// both a compound form and a descendant form so a user's
// `<AdminRoot className="grid">` still picks up `._ao-grid`.
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
        // Scope root is a div; can't be a matched element type. Descendant
        // form is sufficient.
        out.push(`:scope ${original}`);
        break;
      case "universal": {
        // Drop the leading `*` to build the compound form (covers the
        // scope root). Anything else in the first compound and any
        // combinators that follow stay verbatim.
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

// `from` / `to` / `0%` etc. inside `@keyframes` aren't selectors and must not
// be rewritten — `:scope to { ... }` is invalid CSS and breaks downstream
// parsers (sass-loader, lightningcss). Tailwind keeps `@keyframes` nested
// inside `@layer components { ... }`, so the top-level hoist pass doesn't
// catch them; skip rule-walking inside any keyframes ancestor instead.
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

// A single rule prepended as the first child of the scope. It reclaims a
// small set of typography properties on the bare element selectors a host
// stylesheet most commonly styles directly (headings, p, a, list parts,
// form controls, table parts).
//
// The selector list is wrapped in `:where()` so the rule's specificity
// stays at (0,1,0) regardless of how many tags we add. That lets admin's
// bumped class rules (`:scope ._ao-card-title`, (0,2,0)) and a consumer's
// CSS-module class on the same element (also (0,1,0), but loaded after
// admin.css) both still win; a bare host rule like `h3 { font-family }`
// (0,0,1) loses. Host rules with class/id ancestors (`.page h3`, (0,1,1))
// will beat the reset — intentional escape hatch.
//
// `inherit` is the right value for inherited properties; their cascade
// resolves from `:scope`, which carries admin's typography. `normal` and
// `none` are the initial values for the two non-inherited properties.
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
  const root = postcss.parse(css);

  // Collect layer order from the original input before we strip the
  // statements — `flattenLayersInScope` needs it to re-emit layered blocks
  // in declared order, but the statements themselves are dropped from the
  // output. Layered rules always lose to unlayered host rules of any
  // specificity, so we flatten the bundle to unlayered; the statements
  // would otherwise leak Tailwind's layer order into the consumer's
  // document, which is document-wide by spec.
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
