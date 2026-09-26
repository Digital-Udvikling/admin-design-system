// A built docs site (apps/docs/dist) served to Chromium, and its example previews.

import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { MIME } from "./browser.mjs";
import { BASE_URL } from "./bundle.mjs";
import { collectExamples, loadPages } from "./examples.mjs";

export const THEMES = /** @type {const} */ (["light", "dark"]);
export const VIEWPORT = { width: 1280, height: 900 };

/**
 * Serves `dist` at BASE_URL on a free localhost port.
 *
 * @param {string} dist
 * @returns {Promise<{ origin: string; close: () => void }>}
 */
export function serveDist(dist) {
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

/**
 * Site paths (`components/buttons/`) of every page in `dist` that holds an example.
 *
 * @param {string} dist
 * @returns {string[]}
 */
export function examplePages(dist) {
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
 * One browser context per theme: `colorScheme` set, reduced motion, and
 * Starlight's stored theme preset before any page script runs.
 *
 * @param {import("playwright-core").Browser} browser
 * @returns {Promise<Record<string, import("playwright-core").BrowserContext>>}
 */
export async function themeContexts(browser) {
  return Object.fromEntries(
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
}

/**
 * Loads a site page in `theme` and waits for React previews to hydrate and fonts to load.
 *
 * @param {import("playwright-core").Page} page
 * @param {string} url
 * @param {string} theme
 */
export async function openPage(page, url, theme) {
  const res = await page.goto(url, { waitUntil: "networkidle" });
  if (!res?.ok()) throw new Error(`HTTP ${res?.status()}`);
  await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
  // Starlight's fixed header would overlay any example scrolled under it.
  await page.addStyleTag({ content: "header.header { position: absolute !important; }" });
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
 * @typedef {object} TaggedExample
 * @property {string} key       `<heading id>/<n>`: the example's position under the nearest heading above it.
 * @property {number} index     0-based position among the page's examples; set as `data-example-index` on its preview.
 * @property {("vanilla" | "react")[]} variants
 */

/**
 * Tags every example preview on the page with `data-example-index` and lists
 * them. Runs in the page. The key survives edits elsewhere on the page.
 *
 * @returns {TaggedExample[]}
 */
export function tagExamples() {
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
    preview.dataset.exampleIndex = String(index);
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

/**
 * Shows `variant` in every split preview. Runs in the page.
 *
 * @param {"vanilla" | "react"} variant
 */
export function showVariant(variant) {
  const want = variant === "react" ? "react" : "html";
  for (const el of document.querySelectorAll(".example-preview > .preview-variant")) {
    el.hidden = el.dataset.variant !== want;
  }
}

/**
 * Maps a site path and example index to its `file.mdx:line` in this checkout's MDX.
 *
 * @returns {(page: string, index: number) => string | null}
 */
export function sourceLabels() {
  const { pages } = loadPages();
  const byPage = new Map();
  for (const ex of collectExamples(pages)) {
    const path = ex.rel.replace(/(^|\/)index\.mdx$/, "$1").replace(/\.mdx$/, "/");
    if (!byPage.has(path)) byPage.set(path, []);
    byPage.get(path).push(`${ex.rel}:${ex.line}`);
  }
  return (page, index) => byPage.get(page)?.[index] ?? null;
}
