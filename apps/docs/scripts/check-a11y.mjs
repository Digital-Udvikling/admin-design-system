#!/usr/bin/env node
// Run axe-core over every docs example, closed and with its overlays open. See `--help`.

import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "playwright-core";
import { findChrome, pool } from "./lib/browser.mjs";
import { BASE_URL } from "./lib/bundle.mjs";
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

const HELP = `Usage: pnpm check-a11y [<page>...] [--dist <dir>]

Runs axe-core (WCAG 2.2 A and AA) over the preview of every :::example in the built
docs site, vanilla and React, light and dark. Each preview is scanned closed, then
with each overlay open: vanilla <dialog>s and [popover]s shown from script, <details>
opened, CSS tooltips revealed, and React popup triggers clicked. Starlight's own
chrome is never scanned.

<page> limits the run to site paths starting with it (components/buttons).
Exits 1 on any violation, printed as file.mdx:line, variant, theme and rule.

Options:
  --dist <dir>         built docs site (default apps/docs/dist; run pnpm build first)
  --concurrency <n>    pages checked in parallel (default 4)
  -h, --help

Needs Chromium: set CHROME_PATH, or have chromium / google-chrome on PATH.`;

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    dist: { type: "string" },
    concurrency: { type: "string", default: "4" },
    help: { type: "boolean", short: "h" },
  },
});

function fail(message) {
  console.error(`check-a11y: ${message}`);
  process.exit(1);
}

if (opts.help) {
  console.log(HELP);
  process.exit(0);
}

const cwd = process.env.INIT_CWD ?? process.cwd();
const dist = opts.dist ? resolve(cwd, opts.dist) : join(import.meta.dirname, "..", "dist");
if (!existsSync(join(dist, "index.html"))) fail(`${dist} is not a built docs site; run pnpm build`);
const concurrency = Number(opts.concurrency);
if (!(concurrency > 0)) fail("--concurrency must be a positive number");
const chrome = findChrome();
if (chrome === null) fail("no Chromium found; set CHROME_PATH");

const AXE_SOURCE = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);

/** axe `run` options: WCAG A/AA only, minus the rules a docs page embedding fragments trips. */
const AXE_OPTIONS = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  rules: {
    // Examples are fragments inside Starlight's <main>: an app-shell <main> nests in it,
    // and several examples on one page repeat the same landmark label.
    region: { enabled: false },
    "landmark-banner-is-top-level": { enabled: false },
    "landmark-complementary-is-top-level": { enabled: false },
    "landmark-contentinfo-is-top-level": { enabled: false },
    "landmark-main-is-top-level": { enabled: false },
    "landmark-no-duplicate-banner": { enabled: false },
    "landmark-no-duplicate-contentinfo": { enabled: false },
    "landmark-no-duplicate-main": { enabled: false },
    "landmark-one-main": { enabled: false },
    "landmark-unique": { enabled: false },
  },
  resultTypes: ["violations"],
  // Embed examples frame a sandboxed placeholder page, not system markup.
  iframes: false,
};

/**
 * Nodes a rule flags wrongly, matched by `selector` on the flagged element.
 * Each needs a reason; prefer fixing the example.
 */
const IGNORED = [
  {
    rule: "label",
    selector: [
      ':is(.prose, ._ao-prose) li > input[type="checkbox"][disabled]:first-child',
      ':is(.prose, ._ao-prose) li > p:first-child > input[type="checkbox"][disabled]:first-child',
    ].join(", "),
    reason:
      "GFM renders task-list checkboxes disabled and unlabelled; the example mirrors renderer output",
  },
  {
    rule: "color-contrast",
    selector: "output:is(.spinner, ._ao-spinner) *, :is(.spinner, ._ao-spinner)",
    reason: "the spinner is a drawn ring, not text; its colour is its whole content",
  },
  {
    rule: "aria-hidden-focus",
    selector: "[data-base-ui-focus-guard]",
    reason:
      "Base UI's focus guards around a non-modal popup take focus only to hand it on to the trigger or popup",
  },
];

// ---------------------------------------------------------------- in-page helpers

/** Marks the visible panel of every example as `data-a11y-panel` for the current variant. Runs in the page. */
function markPanels(variant) {
  for (const el of document.querySelectorAll("[data-a11y-panel]"))
    el.removeAttribute("data-a11y-panel");
  const want = variant === "react" ? "react" : "html";
  for (const preview of document.querySelectorAll("[data-example-index]")) {
    const split = preview.querySelectorAll(":scope > .preview-variant");
    const panel =
      split.length > 0
        ? [...split].find((v) => v.dataset.variant === want)
        : (preview.querySelector("astro-island, ._ao-admin-root") !== null) ===
            (variant === "react")
          ? preview
          : undefined;
    if (panel) panel.dataset.a11yPanel = preview.dataset.exampleIndex;
  }
}

/**
 * Overlays in the marked panels, as `{ index, kind, n }`: `kind` is how to open
 * it, `n` its position among that kind in the panel. Runs in the page.
 */
function listOverlays(variant) {
  const out = [];
  for (const panel of document.querySelectorAll("[data-a11y-panel]")) {
    const index = Number(panel.dataset.a11yPanel);
    // Tagged up front: opening one (an accordion, a dialog) changes which others match.
    const tag = (kind, list) =>
      list.forEach((el, n) => {
        el.dataset.a11yOverlay = `${index}-${kind}-${n}`;
        out.push({ index, kind, n });
      });
    const details = panel.querySelectorAll("details");
    details.forEach((d) => (d.dataset.a11yWasOpen = String(d.open)));
    if (details.length > 0) out.push({ index, kind: "details", n: 0 });
    if (panel.querySelector(":is(.tooltip, ._ao-tooltip)"))
      out.push({ index, kind: "tooltips", n: 0 });
    tag("dialog", panel.querySelectorAll("dialog:not([open])"));
    tag("popover", panel.querySelectorAll("[popover]"));
    if (variant === "react") {
      // Hidden triggers (in a closed dialog, mobile-only) can't be clicked.
      const triggers = [
        ...panel.querySelectorAll(
          'button:is([aria-haspopup]:not([aria-haspopup="false"]), [aria-expanded="false"]):not([disabled])',
        ),
      ].filter((t) => t.checkVisibility({ visibilityProperty: true }));
      tag("trigger", triggers);
    }
  }
  return out;
}

/** Opens one overlay listed by `listOverlays`. Runs in the page; returns a label, or null for a click. */
function openOverlay({ index, kind, n }) {
  const panel = document.querySelector(`[data-a11y-panel="${index}"]`);
  const el = document.querySelector(`[data-a11y-overlay="${index}-${kind}-${n}"]`);
  if (kind === "details") {
    for (const d of panel?.querySelectorAll("details") ?? []) d.open = true;
    return "details open";
  }
  if (kind === "tooltips") {
    const style = document.createElement("style");
    style.dataset.a11yTooltips = "";
    style.textContent =
      ":is(.tooltip, ._ao-tooltip) { display: block !important; opacity: 1 !important; }";
    document.head.append(style);
    return "tooltips shown";
  }
  if (kind === "dialog") {
    /** @type {HTMLDialogElement} */ (el)?.showModal();
    return `dialog #${n + 1} open`;
  }
  if (kind === "popover") {
    el?.showPopover();
    return `popover #${n + 1} open`;
  }
  return null;
}

/** Undoes `openOverlay` for script-opened overlays. Runs in the page. */
function closeOverlays(index) {
  for (const el of document.querySelectorAll(`[data-a11y-overlay^="${index}-"]`)) {
    if (el instanceof HTMLDialogElement && el.open) el.close();
    else if (el.hasAttribute("popover") && el.matches(":popover-open")) el.hidePopover();
  }
  const panel = document.querySelector(`[data-a11y-panel="${index}"]`);
  for (const d of panel?.querySelectorAll("details") ?? [])
    d.open = d.dataset.a11yWasOpen === "true";
  document.querySelector("style[data-a11y-tooltips]")?.remove();
}

/** Resolves once finite animations and transitions end (popups fade in), or after 1s. Runs in the page. */
function animationsDone() {
  const finite = document
    .getAnimations()
    .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
  return Promise.race([
    Promise.all(finite.map((a) => a.finished.catch(() => {}))),
    new Promise((r) => setTimeout(r, 1000)),
  ]).then(() => {});
}

/** Runs axe over the marked panels (or one) and returns violations per node, attributed to an example. Runs in the page. */
async function scan({ options, index, ignored }) {
  const include =
    index === undefined
      ? [...document.querySelectorAll("[data-a11y-panel]")]
      : [document.querySelector(`[data-a11y-panel="${index}"]`)];
  if (include.length === 0 || include[0] === null) return [];
  const result = await window.axe.run({ include }, options);
  const out = [];
  for (const violation of result.violations) {
    for (const node of violation.nodes) {
      let el = null;
      try {
        el = document.querySelector(node.target[0]);
      } catch {}
      if (ignored.some((i) => i.rule === violation.id && el?.matches(i.selector))) continue;
      const owner = el?.closest("[data-a11y-panel]");
      out.push({
        rule: violation.id,
        impact: violation.impact,
        help: violation.help,
        // The script's own data-a11y-* attributes make targets unique but aren't in the example.
        target: node.target.join(" ").replace(/\[data-a11y-[\w-]+(?:="[^"]*")?\]/g, ""),
        summary: (node.failureSummary ?? "").split("\n").slice(1).join(" ").trim(),
        index: owner ? Number(owner.dataset.a11yPanel) : null,
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------- main

const filters = positionals.map((p) => p.replace(/^\/+/, ""));
const pages = examplePages(dist).filter(
  (p) => filters.length === 0 || filters.some((f) => p.startsWith(f)),
);
if (pages.length === 0) fail("no example pages match");

const label = sourceLabels();
const server = await serveDist(dist);
const browser = await chromium.launch({ executablePath: chrome });
const started = Date.now();
const found = new Map();
const errors = [];
const scans = { closed: 0, open: 0 };
const skipped = [];

try {
  const contexts = await themeContexts(browser);
  const tasks = pages.flatMap((path) =>
    THEMES.map((theme) => async () => {
      const page = await contexts[theme].newPage();
      const record = (variant, state, hits) => {
        scans[state === "closed" ? "closed" : "open"]++;
        for (const hit of hits) {
          const where =
            hit.index === null ? path : (label(path, hit.index) ?? `${path}#${hit.index}`);
          const key = [where, variant, theme, hit.rule, hit.target].join("\u0000");
          if (!found.has(key)) found.set(key, { where, variant, theme, state, ...hit });
        }
      };
      try {
        await openPage(page, `${server.origin}${BASE_URL}${path}`, theme);
        await page.addScriptTag({ content: AXE_SOURCE });
        const examples = await page.evaluate(tagExamples);
        for (const variant of /** @type {const} */ (["vanilla", "react"])) {
          if (!examples.some((e) => e.variants.includes(variant))) continue;
          await page.evaluate(showVariant, variant);
          await page.evaluate(markPanels, variant);
          record(
            variant,
            "closed",
            await page.evaluate(scan, { options: AXE_OPTIONS, ignored: IGNORED }),
          );
          for (const overlay of await page.evaluate(listOverlays, variant)) {
            let state = await page.evaluate(openOverlay, overlay);
            if (state === null) {
              const trigger = page.locator(
                `[data-a11y-overlay="${overlay.index}-trigger-${overlay.n}"]`,
              );
              state = `after clicking ${(await trigger.textContent().catch(() => ""))?.trim() || `trigger #${overlay.n + 1}`}`;
              try {
                await trigger.click({ timeout: 2000 });
              } catch (e) {
                skipped.push(`${path} (${theme}) ${state}: ${String(e).split("\n")[0]}`);
                continue;
              }
            }
            // Transitions start a frame after the popup mounts.
            await page.waitForTimeout(50);
            await page.evaluate(animationsDone);
            record(
              variant,
              state,
              await page.evaluate(scan, {
                options: AXE_OPTIONS,
                index: overlay.index,
                ignored: IGNORED,
              }),
            );
            await page.keyboard.press("Escape");
            await page.evaluate(closeOverlays, overlay.index);
            await page.waitForTimeout(50);
          }
        }
      } catch (e) {
        errors.push(`${path} (${theme}): ${e instanceof Error ? e.message : e}`);
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

const hits = [...found.values()].sort(
  (a, b) =>
    a.where.localeCompare(b.where, "en", { numeric: true }) ||
    a.variant.localeCompare(b.variant) ||
    a.theme.localeCompare(b.theme) ||
    a.rule.localeCompare(b.rule),
);
for (const h of hits) {
  const state = h.state === "closed" ? "" : ` (${h.state})`;
  console.log(`${h.where}  ${h.variant} ${h.theme}${state}  ${h.rule} [${h.impact}]  ${h.target}`);
  console.log(`    ${h.help}${h.summary ? `: ${h.summary}` : ""}`);
}
for (const e of errors) console.error(`error: ${e}`);
for (const e of skipped) console.error(`warning: not scanned: ${e}`);
const seconds = ((Date.now() - started) / 1000).toFixed(0);
console.error(
  `check-a11y: ${hits.length} violation${hits.length === 1 ? "" : "s"} on ${pages.length} pages (${scans.closed} closed scans, ${scans.open} with an overlay open) in ${seconds}s`,
);
process.exit(hits.length === 0 && errors.length === 0 ? 0 : 1);
