import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { describe, expect, test } from "vitest";

// Regression guards for the popup-vs-dialog clipping fix: a dialog's
// `overflow: hidden` clips even `position: fixed` descendants (its identity
// `transform` makes it a containing block). The vanilla menu popup avoids both
// that and `overflow: auto` ancestors by rendering in the top layer as a popover.

const SRC_ROOT = fileURLToPath(new URL("../src/", import.meta.url));

async function parse(relPath) {
  const css = await readFile(new URL(relPath, `file://${SRC_ROOT}`), "utf8");
  return { css, root: postcss.parse(css) };
}

// Exact selector-list match — `.menu-popup` must not also match `.menu-popup-foo`.
function findRules(root, selector) {
  const out = [];
  root.walkRules((rule) => {
    const parts = rule.selector.split(",").map((s) => s.trim());
    if (parts.includes(selector)) out.push(rule);
  });
  return out;
}

function declValues(rules, prop) {
  const values = [];
  for (const rule of rules) {
    rule.walkDecls(prop, (decl) => values.push(decl.value));
  }
  return values;
}

describe("menu.css popover anchoring", () => {
  test(".menu-trigger declares anchor-name --menu-trigger", async () => {
    const { root } = await parse("components/menu.css");
    const anchorNames = declValues(findRules(root, ".menu-trigger"), "anchor-name");
    expect(anchorNames, "expected `.menu-trigger { anchor-name: --menu-trigger }`").toContain(
      "--menu-trigger",
    );
  });

  test(".menu scopes the anchor name so each popup finds its own trigger", async () => {
    const { root } = await parse("components/menu.css");
    const scopes = declValues(findRules(root, ".menu"), "anchor-scope");
    expect(scopes, "expected `.menu { anchor-scope: --menu-trigger }`").toContain("--menu-trigger");
  });

  test(".menu-popup[popover] anchors to --menu-trigger and resets the UA centring", async () => {
    const { root } = await parse("components/menu.css");
    const rules = findRules(root, ".menu-popup[popover]");
    expect(declValues(rules, "position-anchor")).toContain("--menu-trigger");
    expect(declValues(rules, "inset"), "the UA popover rule centres with inset: 0").toContain(
      "auto",
    );
  });

  test(".menu-popup[popover] flips above and toward the start edge via position-try-fallbacks", async () => {
    const { root } = await parse("components/menu.css");
    const options = declValues(
      findRules(root, ".menu-popup[popover]"),
      "position-try-fallbacks",
    ).flatMap((value) => value.split(",").map((option) => option.trim().replace(/\s+/g, " ")));
    expect(options, "expected a flip-block fallback (no room below)").toContain("flip-block");
    expect(options, "expected a flip-inline fallback (no room at the end)").toContain(
      "flip-inline",
    );
    expect(options, "expected the combined corner fallback").toContain("flip-block flip-inline");
  });
});

describe("dialog.css overflow no longer clips fixed descendants", () => {
  test(".dialog base rule does NOT set overflow: hidden", async () => {
    const { root } = await parse("components/dialog.css");
    const dialogRules = findRules(root, ".dialog");
    // overflow-hidden would clip popups inside the dialog; the bottom-corner
    // radius lives on `.dialog-footer` instead.
    for (const rule of dialogRules) {
      rule.walkAtRules("apply", (atRule) => {
        expect(
          atRule.params,
          ".dialog must not @apply overflow-hidden — see popup-clipping fix",
        ).not.toMatch(/\boverflow-hidden\b/);
      });
      rule.walkDecls("overflow", (d) => {
        expect(d.value, ".dialog must not set overflow: hidden").not.toBe("hidden");
      });
    }
  });

  test(".dialog-footer inherits bottom-corner radius (replaces overflow: hidden)", async () => {
    const { root } = await parse("components/dialog.css");
    const footerRules = findRules(root, ".dialog-footer");
    const declsByProp = {};
    for (const rule of footerRules) {
      rule.walkDecls((d) => {
        declsByProp[d.prop] = d.value;
      });
    }
    expect(declsByProp["border-bottom-left-radius"]).toBe("inherit");
    expect(declsByProp["border-bottom-right-radius"]).toBe("inherit");
  });
});
