import { strict as assert } from "node:assert";
import { test } from "node:test";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { wrap } from "./wrap-scoped.mjs";

// Parse the wrapped output and return the @scope at-rule node. Every test
// inspects something about it, so it's worth one helper.
function getScope(output) {
  const root = postcss.parse(output);
  const scope = root.nodes.find((n) => n.type === "atrule" && n.name === "scope");
  assert.ok(scope, "wrap() output must contain an @scope at-rule");
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
      assert.ok(
        part.startsWith(":scope"),
        `selector "${part}" inside @scope should start with :scope`,
      );
    }
  });
});

test("the first rule inside @scope is the bare-element reset", () => {
  const input = `@layer components { .btn { color: red; } }`;
  const scope = getScope(wrap(input));
  const first = scope.nodes.find((n) => n.type === "rule");
  assert.ok(first, "scope must contain at least one rule");
  assert.match(first.selector, /^:scope :where\(/);
  assert.match(first.selector, /\bh3\b/);
  const props = first.nodes.filter((n) => n.type === "decl").map((d) => d.prop);
  assert.ok(props.includes("font-family"), "reset should set font-family");
  assert.ok(props.includes("color"), "reset should set color");
});

test("every class selector inside @scope is prefixed _ao-", () => {
  const input = `@layer components { .btn { color: red; } .card-body { padding: 1rem; } }`;
  const scope = getScope(wrap(input));
  scope.walkRules((rule) => {
    // Ignore the bare-element reset's :where(...) tag list.
    if (rule.selector.includes(":where(")) return;
    const classMatches = rule.selector.match(/\.[\w-]+/g) ?? [];
    for (const cls of classMatches) {
      assert.ok(cls.startsWith("._ao-"), `class "${cls}" inside @scope should be prefixed _ao-`);
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
  assert.ok(foundRootRewrite, ":root should become :scope inside @scope");
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
  assert.ok(found, "._ao-admin-root should be emitted in both compound and descendant form");
});

test("@layer NAME { ... } blocks inside @scope are flattened away", () => {
  const input = `
    @layer theme, base, components;
    @layer base { h3 { font-size: inherit; } }
    @layer components { .btn { color: red; } }
  `;
  const scope = getScope(wrap(input));
  let foundLayerBlock = false;
  scope.walk((node) => {
    if (node.type === "atrule" && node.name === "layer") foundLayerBlock = true;
  });
  assert.ok(!foundLayerBlock, "@layer blocks must not appear inside @scope");
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
  assert.ok(!output.includes(":scope from"), "@keyframes `from` must not be rewritten");
  assert.ok(!output.includes(":scope to"), "@keyframes `to` must not be rewritten");
});
