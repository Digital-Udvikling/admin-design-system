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
 * - Inside the scope, `@layer NAME { ... }` wrappers are stripped and
 *   their contents are re-emitted in declared layer order. Layered author
 *   rules always lose to unlayered author rules in the same origin —
 *   regardless of specificity — so admin's `@layer base { h3 { … } }`
 *   would lose to a host page's unlayered `h3 { font-size: 26px }` no
 *   matter what specificity tricks we apply. Re-emitting admin's rules
 *   unlayered lets specificity decide. The unscoped bundle still keeps
 *   Tailwind's layers; only the scoped variant is flattened.
 * - Every selector inside the scope gets its specificity bumped by
 *   prepending `:scope`. `@scope` itself doesn't contribute specificity,
 *   so without this a host page rule like `h3 { font-size: 2rem }` would
 *   beat admin's now-unlayered `h3 { font-size: inherit }` (both 0,0,1)
 *   on source order. The bump also preserves the within-admin ordering
 *   Tailwind's layers used to provide: `:scope ._ao-card-title` (0,2,0)
 *   beats `:scope h3` (0,1,1) on `<h3 class="_ao-card-title">`, so the
 *   component class wins over the element reset, like it did when
 *   `components` beat `base` via layer ordering.
 *
 *   - Tag/pseudo-element first compounds get the descendant form only
 *     (`h3` → `:scope h3`; `::placeholder` → `:scope ::placeholder`). The
 *     scope root is a div, so it can't match these directly.
 *   - Class, id, attribute, pseudo-class, and universal first compounds
 *     emit both a compound form (which can match the scope root) and a
 *     descendant form: `[data-theme="dark"]` →
 *     `:scope[data-theme="dark"], :scope [data-theme="dark"]`,
 *     `._ao-grid` → `:scope._ao-grid, :scope ._ao-grid`. This keeps
 *     `<AdminRoot data-theme="…" className="grid">` matching admin's
 *     theme + utility rules.
 *
 * - A curated "bare-element reset" is emitted as the first rule inside the
 *   scope. It targets the tag selectors a host stylesheet most commonly
 *   styles directly (`h1`–`h6`, `p`, `a`, list/table parts, form controls)
 *   and forces a small set of inherited typography properties back to the
 *   inheriting value, e.g. `font-family: inherit`. This closes the gap left
 *   by specificity alone — Tailwind's preflight resets `font-size` /
 *   `font-weight` on headings but doesn't touch `font-family`, `color`,
 *   `letter-spacing`, `line-height`, etc., so a host page's
 *   `h3 { font-family: BrandFont }` would otherwise leak into
 *   `<h3 class="_ao-card-title">`. The reclaimed properties then resolve
 *   via inheritance from `:scope`, which sets admin's font, color, and
 *   line height.
 *
 *   The selector list is wrapped in `:where()` so the reset's specificity
 *   stays at (0,1,0) — identical to a single class. That lets:
 *     - admin's own bumped class rules (`:scope ._ao-card-title`, (0,2,0))
 *       win when the consumer renders `<h3 className="card-title">`;
 *     - a consumer's CSS-module class on the same element (also (0,1,0))
 *       win on source order — admin.css is imported once, ahead of any
 *       per-component stylesheet — so `<Card.Title className={s.brand}>`
 *       in vvsshop still gets `s.brand` honored;
 *     - a bare host rule like `h3 { font-family: BrandFont }` (0,0,1)
 *       lose to the reset.
 *
 *   Host rules with class/id ancestors (`.page h3`, (0,1,1)) will still
 *   beat the reset; that's an intentional escape hatch — if a host really
 *   wants to override typography on admin elements, it can opt in.
 *
 *   Unlike a blanket `:where(*) { all: revert }`, this reset can't wipe
 *   properties a consumer explicitly sets on classed children: it only
 *   touches the listed tag selectors, and only the listed declarations.
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
