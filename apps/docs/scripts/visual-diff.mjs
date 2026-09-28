#!/usr/bin/env node
// Screenshot every docs example in two built sites and report which changed. See `--help`.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import { BASE_URL } from "./lib/bundle.mjs";
import { findChrome, pool } from "./lib/browser.mjs";
import {
  THEMES,
  examplePages,
  openPage,
  serveDist,
  showVariant,
  sourceLabels,
  tagExamples,
  themeContexts,
} from "./lib/site.mjs";

const HELP = `Usage: pnpm visual-diff <base-dist> <head-dist> [--out <dir>]
       pnpm visual-diff capture <dist> <dir>
       pnpm visual-diff compare <base-dir> <head-dir> [--out <dir>]

Screenshots the preview of every :::example in a built docs site (apps/docs/dist),
vanilla and React, light and dark, then compares two such captures pixel by pixel.

The default form captures both sites and compares them. capture writes
<dir>/manifest.json and one PNG per cell; compare reads two of those and writes
<out>/summary.md plus before/after/diff PNGs of each changed cell under <out>/cells/.
Examples are matched by page, the heading above them and their position under it.
Head examples are labelled with their file.mdx:line in this checkout.

Exits 0 whatever the diff; only errors (a missing dist, a page that fails to load) exit 1.

Options:
  --out <dir>          report directory (default ./visual-diff)
  --concurrency <n>    pages captured in parallel (default 4)
  -h, --help

Needs Chromium: set CHROME_PATH, or have chromium / google-chrome on PATH. Compare
captures made with the same Chromium; a different build shifts antialiasing.`;

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: "string", default: "visual-diff" },
    concurrency: { type: "string", default: "4" },
    help: { type: "boolean", short: "h" },
  },
});

function fail(message) {
  console.error(`visual-diff: ${message}`);
  process.exit(1);
}

if (opts.help) {
  console.log(HELP);
  process.exit(0);
}

const cwd = process.env.INIT_CWD ?? process.cwd();
const abs = (p) => resolve(cwd, p);
const concurrency = Number(opts.concurrency);
if (!(concurrency > 0)) fail("--concurrency must be a positive number");

// ---------------------------------------------------------------- capture

const CELL_ORDER = ["vanilla-light", "vanilla-dark", "react-light", "react-dark"];

/**
 * Captures every example cell of the site at `dist` into `dir`.
 *
 * @returns {Promise<Manifest>}
 */
async function capture(dist, dir) {
  if (!existsSync(join(dist, "index.html"))) fail(`${dist} is not a built docs site`);
  const chrome = findChrome();
  if (chrome === null) fail("no Chromium found; set CHROME_PATH");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const pages = examplePages(dist);
  const server = await serveDist(dist);
  const browser = await chromium.launch({ executablePath: chrome });
  const started = Date.now();
  /** @type {Manifest} */
  const manifest = { cells: {}, errors: [], warnings: [] };
  try {
    const contexts = await themeContexts(browser);
    const tasks = pages.flatMap((path) =>
      THEMES.map((theme) => async () => {
        const page = await contexts[theme].newPage();
        const pageErrors = [];
        page.on("pageerror", (e) => pageErrors.push(e.message));
        try {
          await openPage(page, `${server.origin}${BASE_URL}${path}`, theme);
          const examples = await page.evaluate(tagExamples);
          for (const variant of ["vanilla", "react"]) {
            const mine = examples.filter((e) => e.variants.includes(variant));
            if (mine.length === 0) continue;
            await page.evaluate(showVariant, variant);
            for (const ex of mine) {
              const id = `${path}#${ex.key}`;
              const cell = `${variant}-${theme}`;
              const file = `${slug(id)}.${cell}.png`;
              const target = page.locator(`[data-example-index="${ex.index}"]`);
              await target.screenshot({
                path: join(dir, file),
                animations: "disabled",
                caret: "hide",
              });
              const entry = (manifest.cells[id] ??= { page: path, index: ex.index, files: {} });
              entry.files[cell] = file;
              entry.files = Object.fromEntries(
                CELL_ORDER.filter((c) => entry.files[c] !== undefined).map((c) => [
                  c,
                  entry.files[c],
                ]),
              );
            }
          }
          for (const message of new Set(pageErrors))
            manifest.warnings.push(`${path} (${theme}): ${message}`);
        } catch (e) {
          manifest.errors.push(`${path} (${theme}): ${e instanceof Error ? e.message : e}`);
        } finally {
          await page.close();
        }
      }),
    );
    await pool(tasks, concurrency);
  } finally {
    await browser.close();
    server.close();
  }
  manifest.cells = Object.fromEntries(
    Object.entries(manifest.cells).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest, null, 1));
  const count = Object.values(manifest.cells).reduce((n, c) => n + Object.keys(c.files).length, 0);
  console.error(
    `visual-diff: captured ${count} cells from ${pages.length} pages in ${((Date.now() - started) / 1000).toFixed(0)}s → ${dir}`,
  );
  return manifest;
}

/**
 * @typedef {object} Manifest
 * @property {Record<string, { page: string; index: number; files: Record<string, string> }>} cells
 *   Keyed by example id (`components/buttons/#variants/0`); `files` maps `vanilla-light` etc. to PNGs.
 * @property {string[]} errors    Pages that failed to load or capture.
 * @property {string[]} warnings  Uncaught errors the pages themselves threw.
 */

const slug = (id) => id.replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "");

// ---------------------------------------------------------------- compare

/** `png` padded with white to `width`×`height`. */
function padded(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height });
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);
  return out;
}

function diffCell(beforeFile, afterFile) {
  const before = PNG.sync.read(readFileSync(beforeFile));
  const after = PNG.sync.read(readFileSync(afterFile));
  const width = Math.max(before.width, after.width);
  const height = Math.max(before.height, after.height);
  const a = padded(before, width, height);
  const b = padded(after, width, height);
  const diff = new PNG({ width, height });
  const pixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  const resized = before.width !== after.width || before.height !== after.height;
  return {
    changed: pixels > 0 || resized,
    ratio: pixels / (width * height),
    resized: resized ? `${before.width}×${before.height} → ${after.width}×${after.height}` : null,
    diff,
  };
}

function compare(baseDir, headDir, outDir) {
  const read = (dir) => {
    const file = join(dir, "manifest.json");
    if (!existsSync(file)) fail(`${dir} has no manifest.json; run capture first`);
    return /** @type {Manifest} */ (JSON.parse(readFileSync(file, "utf8")));
  };
  const base = read(baseDir);
  const head = read(headDir);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(join(outDir, "cells"), { recursive: true });
  const labels = sourceLabels();
  const label = (entry) => labels(entry.page, entry.index);

  const changed = [];
  const added = [];
  const removed = [];
  let compared = 0;
  for (const [id, h] of Object.entries(head.cells)) {
    const b = base.cells[id];
    const where = label(h) ?? id;
    if (b === undefined) {
      added.push(where);
      continue;
    }
    const cells = [];
    for (const [cell, file] of Object.entries(h.files)) {
      if (b.files[cell] === undefined) {
        cells.push({ cell, note: "new cell" });
        continue;
      }
      compared++;
      const result = diffCell(join(baseDir, b.files[cell]), join(headDir, file));
      if (!result.changed) continue;
      const stem = join(outDir, "cells", `${slug(id)}.${cell}`);
      writeFileSync(`${stem}.before.png`, readFileSync(join(baseDir, b.files[cell])));
      writeFileSync(`${stem}.after.png`, readFileSync(join(headDir, file)));
      writeFileSync(`${stem}.diff.png`, PNG.sync.write(result.diff));
      cells.push({
        cell,
        note: `${(result.ratio * 100).toFixed(2)}%${result.resized ? `, ${result.resized}` : ""}`,
      });
    }
    for (const cell of Object.keys(b.files)) {
      if (h.files[cell] === undefined) cells.push({ cell, note: "cell removed" });
    }
    if (cells.length > 0) changed.push({ where, id, cells });
  }
  for (const id of Object.keys(base.cells)) {
    if (head.cells[id] === undefined) removed.push(id);
  }
  changed.sort((a, b) => a.where.localeCompare(b.where, "en", { numeric: true }));
  added.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  const lines = [
    "## Visual diff",
    "",
    changed.length + added.length + removed.length === 0
      ? `No visual changes across ${compared} example cells.`
      : `${changed.length} changed, ${added.length} added, ${removed.length} removed examples (${compared} cells compared). Before, after and diff PNGs are in the \`visual-diff\` artifact under \`cells/\`.`,
  ];
  if (changed.length > 0) {
    lines.push("", "### Changed", "", "| Example | Cells (pixels changed) |", "| --- | --- |");
    for (const c of changed) {
      const cells = c.cells.map((x) => `${x.cell} ${x.note}`).join("<br>");
      lines.push(`| \`${c.where}\`<br><sub>${c.id}</sub> | ${cells} |`);
    }
  }
  if (added.length > 0) lines.push("", "### Added", "", ...added.map((a) => `- \`${a}\``));
  if (removed.length > 0) lines.push("", "### Removed", "", ...removed.map((r) => `- \`${r}\``));
  const errors = [...base.errors.map((e) => `base: ${e}`), ...head.errors.map((e) => `head: ${e}`)];
  if (errors.length > 0) lines.push("", "### Capture errors", "", ...errors.map((e) => `- ${e}`));
  const warnings = [
    ...(base.warnings ?? []).map((e) => `base: ${e}`),
    ...(head.warnings ?? []).map((e) => `head: ${e}`),
  ];
  if (warnings.length > 0) lines.push("", "### Page errors", "", ...warnings.map((e) => `- ${e}`));
  const summary = `${lines.join("\n")}\n`;
  writeFileSync(join(outDir, "summary.md"), summary);
  console.log(summary);
  return errors.length === 0;
}

// ---------------------------------------------------------------- main

const [command, ...args] = positionals;
if (command === "capture") {
  if (args.length !== 2) fail("capture takes <dist> <dir>");
  const manifest = await capture(abs(args[0]), abs(args[1]));
  for (const e of manifest.warnings) console.error(`warning: ${e}`);
  for (const e of manifest.errors) console.error(`error: ${e}`);
  process.exit(manifest.errors.length === 0 ? 0 : 1);
} else if (command === "compare") {
  if (args.length !== 2) fail("compare takes <base-dir> <head-dir>");
  process.exit(compare(abs(args[0]), abs(args[1]), abs(opts.out)) ? 0 : 1);
} else if (positionals.length === 2) {
  const out = abs(opts.out);
  await capture(abs(positionals[0]), join(out, "base"));
  await capture(abs(positionals[1]), join(out, "head"));
  // Captures sit beside the report so one directory holds the whole run.
  const ok = compare(join(out, "base"), join(out, "head"), join(out, "report"));
  process.exit(ok ? 0 : 1);
} else {
  fail(`expected capture, compare, or two dist directories\n\n${HELP}`);
}
