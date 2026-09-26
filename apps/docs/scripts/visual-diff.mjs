#!/usr/bin/env node
// Screenshot every docs example in two built sites and report which changed. See `--help`.

import { createServer } from "node:http";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import { BASE_URL } from "./lib/bundle.mjs";
import { MIME, findChrome, pool } from "./lib/browser.mjs";
import { collectExamples, loadPages } from "./lib/examples.mjs";

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

const THEMES = ["light", "dark"];
const CELL_ORDER = ["vanilla-light", "vanilla-dark", "react-light", "react-dark"];
const VIEWPORT = { width: 1280, height: 900 };

/** Serves `dist` at BASE_URL on a free localhost port. */
function serveDist(dist) {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    if (!path.startsWith(BASE_URL)) return res.writeHead(404).end();
    let file = join(dist, path.slice(BASE_URL.length));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) return res.writeHead(404).end();
    res
      .writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" })
      .end(readFileSync(file));
  });
  return new Promise((ok) =>
    server.listen(0, "127.0.0.1", () => {
      const { port } = /** @type {import("node:net").AddressInfo} */ (server.address());
      ok({ origin: `http://127.0.0.1:${port}`, close: () => server.close() });
    }),
  );
}

/** Site paths (`components/buttons/`) of every page in `dist` that holds an example. */
function examplePages(dist) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (
        entry === "index.html" &&
        readFileSync(full, "utf8").includes('class="not-content example-block')
      ) {
        out.push(relative(dist, dirname(full)).replaceAll("\\", "/").replace(/(.)$/, "$1/"));
      }
    }
  };
  walk(dist);
  return out;
}

/**
 * Tags every example on the page and lists its cells. Runs in the page. The id
 * is `<heading id>/<n>`, the example's position under the nearest heading above
 * it, so an edit elsewhere on the page doesn't renumber it.
 */
function tagExamples() {
  const out = [];
  const seen = new Map();
  let heading = "top";
  let index = 0;
  for (const el of document.querySelectorAll(
    ".sl-markdown-content :is(h2, h3, h4)[id], .example-block",
  )) {
    if (!el.classList.contains("example-block")) {
      heading = el.id;
      continue;
    }
    const n = seen.get(heading) ?? 0;
    seen.set(heading, n + 1);
    const preview = el.querySelector(".example-preview");
    if (preview === null) continue;
    preview.dataset.vdIndex = String(index);
    const split = preview.querySelectorAll(":scope > .preview-variant");
    const variants =
      split.length > 0
        ? [...split].map((v) => (v.dataset.variant === "react" ? "react" : "vanilla"))
        : [preview.querySelector("astro-island, ._ao-admin-root") ? "react" : "vanilla"];
    out.push({ key: `${heading}/${n}`, index, variants });
    index++;
  }
  return out;
}

/** Shows `variant` in every split preview. Runs in the page. */
function showVariant(variant) {
  const want = variant === "react" ? "react" : "html";
  for (const el of document.querySelectorAll(".example-preview > .preview-variant")) {
    el.hidden = el.dataset.variant !== want;
  }
}

async function settle(page) {
  // React previews hydrate (`client:load`); islands drop `ssr` once they have.
  await page
    .waitForFunction(() => document.querySelector("astro-island[ssr]") === null, null, {
      timeout: 10_000,
    })
    .catch(() => {});
  await page.evaluate(() =>
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]),
  );
}

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
    const contexts = Object.fromEntries(
      await Promise.all(
        THEMES.map(async (theme) => {
          const context = await browser.newContext({
            viewport: VIEWPORT,
            colorScheme: theme,
            reducedMotion: "reduce",
          });
          await context.addInitScript((t) => {
            // Sandboxed iframes in examples (dialog embeds) deny storage access.
            try {
              localStorage.setItem("starlight-theme", t);
            } catch {}
          }, theme);
          return [theme, context];
        }),
      ),
    );
    const tasks = pages.flatMap((path) =>
      THEMES.map((theme) => async () => {
        const page = await contexts[theme].newPage();
        const pageErrors = [];
        page.on("pageerror", (e) => pageErrors.push(e.message));
        try {
          const res = await page.goto(`${server.origin}${BASE_URL}${path}`, {
            waitUntil: "networkidle",
          });
          if (!res?.ok()) throw new Error(`HTTP ${res?.status()}`);
          await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
          // Starlight's fixed header would overlay any example scrolled under it.
          await page.addStyleTag({ content: "header.header { position: absolute !important; }" });
          await settle(page);
          const examples = await page.evaluate(tagExamples);
          for (const variant of ["vanilla", "react"]) {
            const mine = examples.filter((e) => e.variants.includes(variant));
            if (mine.length === 0) continue;
            await page.evaluate(showVariant, variant);
            for (const ex of mine) {
              const id = `${path}#${ex.key}`;
              const cell = `${variant}-${theme}`;
              const file = `${slug(id)}.${cell}.png`;
              const target = page.locator(`[data-vd-index="${ex.index}"]`);
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

/** Both PNGs drawn onto a white canvas of their combined size. */
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

/** `components/buttons/#variants/0` → `components/buttons.mdx:42`, from this checkout's MDX. */
function sourceLabels() {
  const { pages } = loadPages();
  const byPage = new Map();
  for (const ex of collectExamples(pages)) {
    const path = ex.rel.replace(/(^|\/)index\.mdx$/, "$1").replace(/\.mdx$/, "/");
    if (!byPage.has(path)) byPage.set(path, []);
    byPage.get(path).push(`${ex.rel}:${ex.line}`);
  }
  return (entry) => byPage.get(entry.page)?.[entry.index] ?? null;
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
  const label = sourceLabels();

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
