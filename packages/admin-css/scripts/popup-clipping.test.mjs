import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { describe, expect, test } from "vitest";

// Regression guards for the popup-vs-dialog clipping fix. Inside a top-layer
// `<dialog>` the dialog's `overflow: hidden` clips even `position: fixed`
// descendants (because its identity `transform` makes it a containing block),
// and `<details>`-based menus get clipped by `overflow: auto` ancestors.
// These tests pin the CSS shape so a refactor can't silently re-introduce
// the bug.

const SRC_ROOT = fileURLToPath(new URL("../src/", import.meta.url));

async function parse(relPath) {
  const css = await readFile(new URL(relPath, `file://${SRC_ROOT}`), "utf8");
  return { css, root: postcss.parse(css) };
}

// Find every rule whose selector list contains the given exact selector — `.menu-popup`
// shouldn't also match `.menu-popup-foo`, so we split on top-level commas first.
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

describe("menu.css anchor-positioning escape hatch", () => {
  test(".menu-trigger declares anchor-name --menu-trigger inside @supports", async () => {
    const { root } = await parse("components/menu.css");
    const triggerRules = findRules(root, ".menu-trigger");
    const anchorNames = declValues(triggerRules, "anchor-name");
    expect(anchorNames, "expected `.menu-trigger { anchor-name: --menu-trigger }`").toContain(
      "--menu-trigger",
    );
  });

  test(".menu-popup anchors to --menu-trigger via position-anchor", async () => {
    const { root } = await parse("components/menu.css");
    const popupRules = findRules(root, ".menu-popup");
    const anchors = declValues(popupRules, "position-anchor");
    expect(anchors, "expected `.menu-popup { position-anchor: --menu-trigger }`").toContain(
      "--menu-trigger",
    );
  });

  test(".menu-popup uses position: fixed in the anchor branch so it escapes clipping", async () => {
    const { root } = await parse("components/menu.css");
    const popupRules = findRules(root, ".menu-popup");
    const positions = declValues(popupRules, "position");
    // Two declarations land here — the `position: absolute` fallback for
    // browsers without anchor positioning, AND `position: fixed` inside the
    // `@supports (anchor-name)` branch. Both are needed.
    expect(
      positions,
      "expected `.menu-popup { position: fixed }` inside the anchor branch",
    ).toContain("fixed");
  });

  test(".menu-popup flips above the trigger via position-try-fallbacks", async () => {
    const { root } = await parse("components/menu.css");
    const popupRules = findRules(root, ".menu-popup");
    const tryFallbacks = declValues(popupRules, "position-try-fallbacks");
    expect(
      tryFallbacks,
      "expected `.menu-popup { position-try-fallbacks: --menu-popup-flip-up }`",
    ).toContain("--menu-popup-flip-up");
  });

  test("@position-try --menu-popup-flip-up swaps top -> bottom: anchor(top)", async () => {
    const { root } = await parse("components/menu.css");
    let positionTry;
    root.walkAtRules("position-try", (rule) => {
      if (rule.params.trim() === "--menu-popup-flip-up") positionTry = rule;
    });
    expect(positionTry, "expected `@position-try --menu-popup-flip-up` block").toBeTruthy();
    const decls = {};
    positionTry.walkDecls((d) => {
      decls[d.prop] = d.value;
    });
    expect(decls.bottom, "flip block should set `bottom: anchor(top)`").toBe("anchor(top)");
  });
});

describe("dialog.css overflow no longer clips fixed descendants", () => {
  test(".dialog base rule does NOT set overflow: hidden", async () => {
    const { root } = await parse("components/dialog.css");
    const dialogRules = findRules(root, ".dialog");
    // .dialog applies overflow via Tailwind `@apply overflow-hidden` if
    // present — but it shouldn't, because that clips popups inside it (the
    // dialog's identity transform makes it a containing block for the
    // popup's position: fixed). The fix puts the bottom-corner radius on
    // `.dialog-footer` instead.
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
