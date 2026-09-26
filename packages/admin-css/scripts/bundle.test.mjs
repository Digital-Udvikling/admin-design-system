import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import postcss from "postcss";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

// Regression guards for utility leakage: admin.css once auto-scanned the repo
// and shipped stray utilities, and Tailwind's `.container` utility overrode
// container.css (likewise `.table` and `.table-cell`). Compiles fresh into a temp dir;
// dist/ may be stale.

const PKG_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SRC = join(PKG_ROOT, "src");
const require = createRequire(import.meta.url);
const TAILWIND_CLI = resolve(
  dirname(require.resolve("@tailwindcss/cli/package.json")),
  require("@tailwindcss/cli/package.json").bin.tailwindcss,
);
const TAILWIND_INDEX = require.resolve("tailwindcss/index.css");

const run = promisify(execFile);

async function compile(input, output, cwd) {
  await run(process.execPath, [TAILWIND_CLI, "-i", input, "-o", output], { cwd });
  return postcss.parse(await readFile(output, "utf8"));
}

function utilitySelectors(root) {
  const selectors = [];
  root.walkAtRules("layer", (layer) => {
    if (layer.params.trim() !== "utilities" || !layer.nodes) return;
    layer.walkRules((rule) => selectors.push(rule.selector));
  });
  return selectors;
}

function hasComponentRule(root, selector) {
  let found = false;
  root.walkAtRules("layer", (layer) => {
    if (layer.params.trim() !== "components") return;
    layer.walkRules((rule) => {
      if (rule.selectors.includes(selector)) found = true;
    });
  });
  return found;
}

let dir;
let admin;
let consumer;
let utilities;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "admin-css-bundle-"));
  // Mirrors getting-started/tailwind.mdx; the inline source forces the
  // candidates that share a name with component classes.
  const fixture = join(dir, "consumer.css");
  await writeFile(
    fixture,
    [
      `@import "${TAILWIND_INDEX}";`,
      `@source inline("container table table-cell flex");`,
      `@import "${join(SRC, "theme.css")}";`,
      `@import "${join(SRC, "components/index.css")}";`,
    ].join("\n"),
  );
  [admin, consumer, utilities] = await Promise.all([
    compile(join(SRC, "admin.css"), join(dir, "admin.css"), PKG_ROOT),
    // cwd is the empty temp dir so auto source detection scans nothing else.
    compile(fixture, join(dir, "consumer.out.css"), dir),
    compile(join(SRC, "utilities.css"), join(dir, "utilities.css"), PKG_ROOT),
  ]);
}, 60_000);

afterAll(async () => {
  if (dir) await rm(dir, { recursive: true, force: true });
});

describe("admin.css", () => {
  test("ships no Tailwind utilities", () => {
    expect(utilitySelectors(admin)).toEqual([]);
  });

  test("still ships the component rules", () => {
    expect(hasComponentRule(admin, ".btn")).toBe(true);
    expect(hasComponentRule(admin, ".container")).toBe(true);
  });
});

describe("admin.utilities.css", () => {
  test.each([".container", ".table", ".table-cell"])("does not ship the %s utility", (selector) => {
    expect(utilitySelectors(utilities)).not.toContain(selector);
  });
});

describe("Tailwind consumer path (components/index.css beside tailwindcss)", () => {
  test.each([".container", ".table", ".table-cell"])(
    "does not generate the %s utility that shares a component's name",
    (selector) => {
      expect(utilitySelectors(consumer)).not.toContain(selector);
      expect(hasComponentRule(consumer, selector)).toBe(true);
    },
  );

  test("still generates other inline candidates, so the exclusion is what drops them", () => {
    expect(utilitySelectors(consumer)).toContain(".flex");
  });
});
