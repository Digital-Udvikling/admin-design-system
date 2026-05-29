import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { expect, test } from "vitest";
import { wrap } from "./wrap-scoped.mjs";

// Parse the wrapped output and return the @scope at-rule node. Every test
// inspects something about it, so it's worth one helper.
function getScope(output) {
  const root = postcss.parse(output);
  const scope = root.nodes.find((n) => n.type === "atrule" && n.name === "scope");
  expect(scope, "wrap() output must contain an @scope at-rule").toBeTruthy();
  return scope;
}

// Split a selector list on top-level commas only — commas inside `:where()`,
// `:is()`, `[attr=","]`, etc. must not split. Naive `selector.split(",")`
// gets this wrong.
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
  // `.admin-root` after prefix is `._ao-admin-root`. Both `:scope._ao-admin-root`
  // (matches the scope element itself) and `:scope ._ao-admin-root` (matches
  // nested instances) should be emitted, so styles like `data-theme` set on
  // <AdminRoot> apply to the wrapper.
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
  // Statements (`@layer theme, base;`) are document-wide by spec, so leaving
  // them in the scoped bundle would silently declare layer order in the
  // consumer's document. Blocks (`@layer base { ... }`) get flattened away
  // and re-emitted unlayered so admin's rules can compete with host rules
  // on specificity instead of always losing to unlayered host rules.
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
  // The :root/html/body rewrite must split selector lists on top-level commas
  // only — a naive split corrupts `[data-x="1,2"]` into `[data-x="1, 2"]`,
  // which no longer matches an element with `data-x="1,2"`.
  const input = `@layer components { .a[data-x="1,2"] { color: red; } }`;
  const output = wrap(input);
  expect(output).toContain('[data-x="1,2"]');
  expect(output).not.toContain('[data-x="1, 2"]');
});

test("@keyframes selectors are not rewritten", () => {
  // `from` and `to` inside @keyframes are step selectors, not element selectors.
  // Rewriting them to `:scope from { ... }` would emit invalid CSS.
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
