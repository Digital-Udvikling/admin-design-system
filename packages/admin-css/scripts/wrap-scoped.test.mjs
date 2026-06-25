import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { expect, test } from "vitest";
import { wrap } from "./wrap-scoped.mjs";

function getScope(output) {
  const root = postcss.parse(output);
  const scope = root.nodes.find((n) => n.type === "atrule" && n.name === "scope");
  expect(scope, "wrap() output must contain an @scope at-rule").toBeTruthy();
  return scope;
}

// Split on top-level commas only — naive split(",") breaks inside :is()/:where()/[attr=","].
function topLevelSelectors(selectorList) {
  const root = selectorParser().astSync(selectorList);
  return root.nodes.map((s) => s.toString().trim());
}

test("every rule inside @scope has a selector starting with :scope", () => {
  const input = `
    @layer theme, base, components, utilities;
    @layer components {
      .btn { color: red; }
      h3 { font-size: inherit; }
      .btn:hover { color: blue; }
    }
  `;
  const scope = getScope(wrap(input));
  scope.walkRules((rule) => {
    for (const part of topLevelSelectors(rule.selector)) {
      expect(part, `selector "${part}" inside @scope should start with :scope`).toMatch(/^:scope/);
    }
  });
});

test("the first rule inside @scope is the bare-element reset", () => {
  const input = `@layer components { .btn { color: red; } }`;
  const scope = getScope(wrap(input));
  const first = scope.nodes.find((n) => n.type === "rule");
  expect(first).toBeTruthy();
  expect(first.selector).toMatch(/^:scope :where\(/);
  expect(first.selector).toMatch(/\bh3\b/);
  const props = first.nodes.filter((n) => n.type === "decl").map((d) => d.prop);
  expect(props).toContain("font-family");
  expect(props).toContain("color");
});

test("every class selector inside @scope is prefixed _ao-", () => {
  const input = `@layer components { .btn { color: red; } .card-body { padding: 1rem; } }`;
  const scope = getScope(wrap(input));
  scope.walkRules((rule) => {
    // Ignore the bare-element reset's :where(...) tag list.
    if (rule.selector.includes(":where(")) return;
    const classMatches = rule.selector.match(/\.[\w-]+/g) ?? [];
    for (const cls of classMatches) {
      expect(cls, `class "${cls}" inside @scope should be prefixed _ao-`).toMatch(/^\._ao-/);
    }
  });
});

test(":root rules are rewritten to :scope", () => {
  const input = `@layer theme { :root { --color: red; } }`;
  const scope = getScope(wrap(input));
  let foundRootRewrite = false;
  scope.walkRules((rule) => {
    if (rule.selector.startsWith(":scope") && rule.toString().includes("--color")) {
      foundRootRewrite = true;
    }
  });
  expect(foundRootRewrite, ":root should become :scope inside @scope").toBe(true);
});

test("admin-root class emits dual compound+descendant form", () => {
  // Both the compound form (the scope element itself) and the descendant form
  // must be emitted, so styles like `data-theme` set on <AdminRoot> apply.
  const input = `@layer base { .admin-root { color-scheme: light dark; } }`;
  const scope = getScope(wrap(input));
  let found = false;
  scope.walkRules((rule) => {
    if (
      rule.selector.includes(":scope._ao-admin-root") &&
      rule.selector.includes(":scope ._ao-admin-root")
    ) {
      found = true;
    }
  });
  expect(found, "._ao-admin-root should be emitted in both compound and descendant form").toBe(
    true,
  );
});

test("no @layer statements or blocks appear anywhere in the output", () => {
  // @layer statements are document-wide by spec; leaked, they'd declare layer
  // order in the consumer's document. Blocks must be re-emitted unlayered.
  const input = `
    @layer theme, base, components;
    @layer base { h3 { font-size: inherit; } }
    @layer components { .btn { color: red; } }
  `;
  const output = wrap(input);
  const root = postcss.parse(output);
  let found = false;
  root.walkAtRules("layer", () => {
    found = true;
  });
  expect(found, "@layer must not appear in the wrapped output").toBe(false);
});

test("commas inside quoted attribute values are not mangled", () => {
  // Guards the rewrite's top-level comma split — a naive split would corrupt
  // `[data-x="1,2"]` into `[data-x="1, 2"]`.
  const input = `@layer components { .a[data-x="1,2"] { color: red; } }`;
  const output = wrap(input);
  expect(output).toContain('[data-x="1,2"]');
  expect(output).not.toContain('[data-x="1, 2"]');
});

test("@keyframes selectors are not rewritten", () => {
  // Keyframe steps aren't element selectors; `:scope from` is invalid CSS.
  const input = `
    @layer components {
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    }
  `;
  const output = wrap(input);
  expect(output).not.toContain(":scope from");
  expect(output).not.toContain(":scope to");
});

test("native CSS nesting is flattened — no `&` survives, hover targets the element not the scope root", () => {
  // The scoped bundle is embedded into host apps that re-process it. Native `&`
  // nesting left inside @scope gets mis-lowered to a bare `:scope` by some
  // toolchains (LightningCSS), rewriting `._ao-btn-muted:hover` to `:scope:hover`
  // and killing every state rule. Ship it pre-flattened instead.
  const input = `
    @layer components {
      .btn-muted {
        background-color: white;
        &:hover {
          @media (hover: hover) { background-color: gray; }
        }
      }
    }
  `;
  const output = wrap(input);
  expect(output, "no native nesting selector may survive").not.toContain("&");

  const scope = getScope(output);
  let hoverSelector = null;
  scope.walkRules((rule) => {
    if (rule.selector.includes(":hover")) hoverSelector = rule.selector;
  });
  expect(hoverSelector, "a :hover rule must exist").toBeTruthy();
  for (const part of topLevelSelectors(hoverSelector)) {
    // Must target the button (`...._ao-btn-muted:hover`), never the bare scope root.
    expect(part).toMatch(/_ao-btn-muted:hover$/);
    expect(part).not.toMatch(/^:scope:hover$/);
  }
});
