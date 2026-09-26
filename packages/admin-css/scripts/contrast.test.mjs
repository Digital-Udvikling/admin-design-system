import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// WCAG 2 contrast of the semantic token pairs components render as text, in both modes.

const theme = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");

const palette = Object.fromEntries(
  [...theme.matchAll(/--color-([a-z]+(?:-\d+)?):\s*(#[0-9a-f]{6});/g)].map((m) => [m[1], m[2]]),
);

/** `{ light, dark }` hex of a semantic token declared as `light-dark(var(..), var(..))` or `var(..)`. */
function token(name) {
  const decl = new RegExp(`--color-${name}:\\s*([^;]+);`).exec(theme);
  if (decl === null) throw new Error(`--color-${name} is not declared in theme.css`);
  const refs = [...decl[1].matchAll(/var\(--color-([a-z]+(?:-\d+)?)\)/g)].map((m) => m[1]);
  const [light, dark = light] = refs.map((ref) => {
    const hex = palette[ref];
    if (hex === undefined) throw new Error(`--color-${name} references non-palette --color-${ref}`);
    return hex;
  });
  if (light === undefined) throw new Error(`--color-${name} is not a palette reference`);
  return { light, dark };
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const SURFACES = ["surface", "surface-muted"];

/** `[foreground, background]` token pairs that must reach 4.5:1. */
const PAIRS = [
  ...["text", "text-muted", "link"].flatMap((fg) => SURFACES.map((bg) => [fg, bg])),
  ["text", "surface-strong"],
  ["code-text", "code-surface"],
  ["primary-content", "primary"],
  ["primary-content", "primary-hover"],
  // Warning is fill-only: `text-warning` never sets text, only `text-warning-content` on it.
  ["warning-content", "warning"],
  ["warning-content", "warning-hover"],
  ...["danger", "success", "info"].flatMap((accent) => [
    ...[...SURFACES, `${accent}-muted`].map((bg) => [accent, bg]),
    [`${accent}-content`, accent],
    [`${accent}-content`, `${accent}-hover`],
  ]),
  // `btn-danger-ghost` sets its label in danger-hover, on the page and on its danger-muted hover fill.
  ...[...SURFACES, "danger-muted"].map((bg) => ["danger-hover", bg]),
];

describe("semantic token contrast", () => {
  for (const mode of ["light", "dark"]) {
    it.each(PAIRS)(`${mode}: %s on %s reaches 4.5:1`, (fg, bg) => {
      expect(ratio(token(fg)[mode], token(bg)[mode])).toBeGreaterThanOrEqual(4.5);
    });
  }
});
