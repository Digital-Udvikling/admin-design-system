#!/usr/bin/env node
// Screenshot docs examples (or an ad-hoc snippet) as vanilla and React, in light
// and dark, composed into one PNG. See `--help`.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium } from "playwright-core";
import { BASE_URL, bundle } from "./lib/bundle.mjs";
import { MIME, findChrome as lookupChrome, pool } from "./lib/browser.mjs";
import {
  collectExamples,
  loadPages,
  previewSource,
  selectExamples,
  walk,
} from "./lib/examples.mjs";
import { buildPreviewSource } from "../plugins/example/index.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(SCRIPT_DIR, "..");
const REPO_ROOT = join(DOCS_ROOT, "..", "..");
const CSS_PKG = join(REPO_ROOT, "packages", "admin-css");
const CSS_DIST = join(CSS_PKG, "dist");
const REACT_ENTRY = join(REPO_ROOT, "packages", "admin-react", "src", "index.ts");
const TABLER_CSS = join(
  DOCS_ROOT,
  "node_modules",
  "@tabler",
  "icons-webfont",
  "dist",
  "tabler-icons.min.css",
);
const PUBLIC_DIR = join(DOCS_ROOT, "public");

const HELP = `Usage: pnpm render <ref>... [options]
       pnpm render --html '<button class="btn">Save</button>' --tsx '<Button>Save</Button>' [options]

Renders each example's vanilla and React fences in light and dark mode into one
PNG and prints its path. React renders client-side in AdminRoot against
admin-react source; vanilla against admin.css. Both load admin.utilities.css.
admin-css is rebuilt first when its source is newer than dist.

<ref>  components/buttons.mdx         every example on the page, one PNG each
       components/buttons.mdx:42      the example whose :::example block spans line 42
       components/buttons.mdx#3       the 4th example on the page (0-based)

Options:
  --html <code>        ad-hoc vanilla markup
  --tsx <code>         ad-hoc React JSX; admin-react exports, Icon* from
                       @tabler/icons-react, and React hooks are auto-imported
  --theme <t>          light | dark | both (default both)
  --variant <v>        vanilla | react | both (default both)
  --width <px>         viewport width of each cell (default 720)
  --scale <n>          device scale factor (default 1)
  --click <selector>   click the first match in each cell before capture; repeatable,
                       applied in order (opens dialogs, menus, popovers)
  --probe <selector>   print each match's box and computed styles per cell; repeatable.
                       Class selectors also match the React side's _ao- prefix
  --props <list>       comma-separated properties for --probe
                       (default display,color,background-color,font-size)
  --out <file.png>     output path (single example only; default under ${join(tmpdir(), "aortl-render")})
  -h, --help

Needs Chromium: set CHROME_PATH, or have chromium / google-chrome on PATH.`;

const { values: opts, positionals: refs } = parseArgs({
  allowPositionals: true,
  options: {
    html: { type: "string" },
    tsx: { type: "string" },
    theme: { type: "string", default: "both" },
    variant: { type: "string", default: "both" },
    width: { type: "string", default: "720" },
    scale: { type: "string", default: "1" },
    click: { type: "string", multiple: true, default: [] },
    probe: { type: "string", multiple: true, default: [] },
    props: { type: "string", default: "display,color,background-color,font-size" },
    out: { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});

function fail(message) {
  console.error(`render: ${message}`);
  process.exit(1);
}

if (opts.help) {
  console.log(HELP);
  process.exit(0);
}
const snippet = opts.html !== undefined || opts.tsx !== undefined;
if (!snippet && refs.length === 0) fail(`nothing to render\n\n${HELP}`);
if (snippet && refs.length > 0) fail("pass either <ref>s or --html/--tsx, not both");

const pick = (value, name) => {
  if (value === "both") return name === "theme" ? ["light", "dark"] : ["vanilla", "react"];
  const allowed = name === "theme" ? ["light", "dark"] : ["vanilla", "react"];
  if (!allowed.includes(value)) fail(`--${name} must be ${allowed.join(" | ")} | both`);
  return [value];
};
const themes = pick(opts.theme, "theme");
const variants = pick(opts.variant, "variant");
const width = Number(opts.width);
const scale = Number(opts.scale);
if (!(width > 0)) fail("--width must be a positive number");
if (!(scale > 0)) fail("--scale must be a positive number");
const probeProps = opts.props
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// ---------------------------------------------------------------- targets

/** @type {{ label: string; slug: string; html?: string; module?: import("./lib/bundle.mjs").PreviewModule }[]} */
const targets = [];

if (snippet) {
  targets.push({
    label: "snippet",
    slug: "snippet",
    html: opts.html,
    module:
      opts.tsx === undefined
        ? undefined
        : { source: snippetModule(opts.tsx), resolveDir: DOCS_ROOT },
  });
} else {
  const { pages, errors } = loadPages();
  for (const e of errors) console.error(`warning: ${e}`);
  const examples = collectExamples(pages);
  for (const ref of refs) {
    let selected;
    try {
      selected = selectExamples(examples, ref);
    } catch (e) {
      fail(e instanceof Error ? e.message : String(e));
    }
    for (const ex of selected) {
      const source = previewSource(ex);
      targets.push({
        label: `${ex.rel}:${ex.line}`,
        slug: `${ex.rel.replace(/\.mdx$/, "").replaceAll("/", "-")}-${ex.line}`,
        html: ex.html?.value,
        module: source === null ? undefined : { source, resolveDir: dirname(ex.abs) },
      });
    }
  }
}
if (opts.out !== undefined && targets.length > 1) {
  fail(`--out takes a single example; the refs select ${targets.length}`);
}

/**
 * Preview module for ad-hoc JSX: auto-imports the admin-react exports,
 * `Icon*` components, and React hooks the snippet names.
 */
function snippetModule(tsx) {
  const names = new Set(tsx.match(/\b[A-Za-z_]\w*\b/g) ?? []);
  const admin = adminReactExports().filter((n) => names.has(n));
  const icons = [...names].filter((n) => /^Icon[A-Z0-9]\w*$/.test(n));
  const hooks = [
    "useState",
    "useEffect",
    "useRef",
    "useMemo",
    "useCallback",
    "useId",
    "Fragment",
  ].filter((n) => names.has(n));
  const imports = [
    admin.length > 0 && `import { ${admin.join(", ")} } from "@aortl/admin-react";`,
    icons.length > 0 && `import { ${icons.join(", ")} } from "@tabler/icons-react";`,
    hooks.length > 0 && `import { ${hooks.join(", ")} } from "react";`,
  ].filter(Boolean);
  return buildPreviewSource(imports.join("\n"), tsx);
}

/** Value exports named in admin-react's `index.ts` `export { … }` lists. */
function adminReactExports() {
  const src = readFileSync(REACT_ENTRY, "utf8");
  const out = [];
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const spec of m[1].split(",")) {
      const s = spec.trim();
      if (s === "" || s.startsWith("type ")) continue;
      out.push(s.split(/\s+as\s+/).at(-1));
    }
  }
  return out;
}

// ---------------------------------------------------------------- css

/** Rebuilds the three bundles a render loads when any admin-css source is newer. */
function ensureCss() {
  const outputs = ["admin.css", "admin.utilities.css", "admin.scoped.css"].map((f) =>
    join(CSS_DIST, f),
  );
  const oldest = Math.min(...outputs.map((f) => (existsSync(f) ? statSync(f).mtimeMs : 0)));
  const newest = Math.max(...walk(join(CSS_PKG, "src"), ".css").map((f) => statSync(f).mtimeMs));
  if (newest <= oldest) return;
  console.error("render: admin-css source changed, rebuilding dist…");
  // build:scoped also wraps admin.min.css, so a fresh checkout needs build:min first.
  for (const script of ["build:dev", "build:min", "build:utilities", "build:scoped"]) {
    execFileSync("pnpm", ["run", script], { cwd: CSS_PKG, stdio: "ignore" });
  }
  // Tailwind leaves an unchanged output unwritten, which would keep it looking stale.
  const now = new Date();
  for (const f of outputs) utimesSync(f, now, now);
}

// ---------------------------------------------------------------- pages

const ORIGIN = "http://render.test";
const fsUrl = (abs) => `${ORIGIN}/@fs${abs}`;

/** Mounts preview `i` into `#root`; sets `window.__rendered` once committed. */
const GLUE = (count) => `
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
${Array.from({ length: count }, (_, i) => `import E${i} from "example:${i}";`).join("\n")}
const previews = [${Array.from({ length: count }, (_, i) => `E${i}`).join(", ")}];
window.__mount = (i) => {
  const Preview = previews[i];
  // A later sibling, so its effect runs after the preview's own effects.
  function Done() {
    useEffect(() => { window.__rendered = true; }, []);
    return null;
  }
  createRoot(document.getElementById("root")).render(<><Preview /><Done /></>);
};
`;

// Mirrors `.example-preview` in plugins/example/Example.astro. The React side's
// AdminRoot is the frame there too: the docs make it `display: contents` inside one.
const FRAME = `display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; padding: 1.5rem;
  box-sizing: border-box; min-height: 100vh; background: var(--color-surface); color: var(--color-text);`;
const FRAME_SELECTOR = { vanilla: "#frame", react: "#root > ._ao-admin-root" };

function cellHtml({ variant, theme, html, moduleIndex }) {
  // Layer the unlayered scoped bundle below utilities, as global.css does, or its reset beats them.
  const scoped =
    variant === "react"
      ? `<style>@layer theme, base, admin, components, utilities; @import url("${fsUrl(join(CSS_DIST, "admin.scoped.css"))}") layer(admin);</style>`
      : "";
  const links = [
    scoped,
    ...[TABLER_CSS, ...(variant === "vanilla" ? [join(CSS_DIST, "admin.css")] : [])].map(
      (f) => `<link rel="stylesheet" href="${fsUrl(f)}">`,
    ),
    `<link rel="stylesheet" href="${fsUrl(join(CSS_DIST, "admin.utilities.css"))}">`,
  ].join("\n");
  const frame = FRAME_SELECTOR[variant];
  const style = `body { margin: 0; } ${frame} { ${FRAME} } ${frame}:has(.tooltip-wrap) { padding: 3rem; }`;
  const body =
    variant === "vanilla"
      ? `<div id="frame">${html}</div>`
      : `<div id="root"></div><script src="${ORIGIN}/bundle.js"></script><script>__mount(${moduleIndex})</script>`;
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">${links}<style>${style}</style></head><body>${body}</body></html>`;
}

const fileCache = new Map();
// Shared across cells: each context starts with an empty HTTP cache, and
// refetching the webfonts per cell dominated the render time.
const remoteCache = new Map();

async function serve(page, state) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) {
      let hit = remoteCache.get(url.href);
      if (hit === undefined) {
        try {
          const res = await route.fetch();
          hit = { status: res.status(), headers: res.headers(), body: await res.body() };
          remoteCache.set(url.href, hit);
        } catch {
          return route.abort();
        }
      }
      return route.fulfill(hit);
    }
    const { pathname } = url;
    if (pathname === "/") return route.fulfill({ contentType: "text/html", body: state.document });
    if (pathname === "/bundle.js")
      return route.fulfill({ contentType: "text/javascript", body: state.bundleJs ?? "" });
    const file = pathname.startsWith("/@fs/")
      ? decodeURIComponent(pathname.slice("/@fs".length))
      : pathname.startsWith(BASE_URL)
        ? join(PUBLIC_DIR, decodeURIComponent(pathname.slice(BASE_URL.length)))
        : null;
    if (file === null || !existsSync(file)) return route.fulfill({ status: 404, body: "" });
    if (!fileCache.has(file)) fileCache.set(file, readFileSync(file));
    return route.fulfill({
      contentType: MIME[extname(file)] ?? "application/octet-stream",
      body: fileCache.get(file),
    });
  });
}

/** Class selectors also match their `_ao-` prefixed form. */
function widenSelector(selector) {
  return selector.replace(/\.(?!_ao-)(-?[_a-zA-Z][\w-]*)/g, ":is(.$1, ._ao-$1)");
}

/**
 * Bottom/right edge of the content inside the frame, in CSS px. Runs in the
 * page; measuring descendants, not the frame, catches fixed and top-layer
 * elements (open dialogs, popovers) and ignores the frame's `min-height`.
 */
function contentExtent(frameSelector) {
  let bottom = 0;
  let right = 0;
  for (const el of document.querySelector(frameSelector)?.querySelectorAll("*") ?? []) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    bottom = Math.max(bottom, r.bottom + window.scrollY);
    right = Math.max(right, r.right + window.scrollX);
  }
  return { bottom: Math.ceil(bottom), right: Math.ceil(right) };
}

/**
 * A page reused across cells of one theme; `state` holds what it serves and
 * collects its console output.
 */
async function openPage(browser, theme) {
  const context = await browser.newContext({
    viewport: { width, height: 200 },
    deviceScaleFactor: scale,
    colorScheme: theme,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const state = { document: "", bundleJs: "", messages: [] };
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning")
      state.messages.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => state.messages.push(`pageerror: ${e.message}`));
  await serve(page, state);
  return { page, state };
}

async function captureCell({ page, state }, { variant, theme, html, moduleIndex, bundleJs }) {
  state.document = cellHtml({ variant, theme, html, moduleIndex });
  state.bundleJs = bundleJs;
  const messages = (state.messages = []);
  await page.setViewportSize({ width, height: 200 });
  await page.goto(`${ORIGIN}/`);
  if (variant === "react") {
    await page
      .waitForFunction(() => window.__rendered === true, null, { timeout: 5000 })
      .catch(() => {
        messages.push("error: React preview did not render within 5s");
      });
  }
  // Remote webfonts (Plex from Google) may be unreachable; fall back after 3s.
  await page.evaluate(() =>
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]),
  );
  for (const selector of opts.click) {
    try {
      await page.locator(widenSelector(selector)).first().click({ timeout: 2000 });
      await page.waitForTimeout(100);
    } catch {
      messages.push(`warning: --click ${selector} matched nothing clickable`);
    }
  }
  // Size the viewport to the content; a second pass settles viewport-relative layout (centered dialogs).
  for (let pass = 0; pass < 2; pass++) {
    const { bottom } = await page.evaluate(contentExtent, FRAME_SELECTOR[variant]);
    await page.setViewportSize({ width, height: Math.min(Math.max(bottom + 24, 48), 4000) });
  }
  const { right } = await page.evaluate(contentExtent, FRAME_SELECTOR[variant]);
  if (right > width)
    messages.push(`warning: content is ${right}px wide, overflowing the ${width}px cell`);

  const probes = [];
  for (const selector of opts.probe) {
    const found = await page.evaluate(
      ({ selector, props }) =>
        [...document.querySelectorAll(selector)].map((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const tag = el.tagName.toLowerCase();
          const cls = el.getAttribute("class");
          return {
            el: cls ? `<${tag} class="${cls}">` : `<${tag}>`,
            box: `${Math.round(r.width * 10) / 10}×${Math.round(r.height * 10) / 10} @ ${Math.round(r.x)},${Math.round(r.y)}`,
            styles: props.map((p) => `${p}: ${cs.getPropertyValue(p)}`),
          };
        }),
      { selector: widenSelector(selector), props: probeProps },
    );
    probes.push({ selector, found });
  }

  const png = await page.screenshot({ animations: "disabled" });
  return { png, messages: [...messages], probes };
}

/** One PNG: a labelled grid, rows = themes, columns = variants. */
async function compose(browser, label, cells) {
  const page = await browser.newPage({
    viewport: { width: 400, height: 200 },
    deviceScaleFactor: scale,
  });
  const columns = variants.length;
  const img = (c) =>
    `<figure><figcaption>${c.variant} · ${c.theme}</figcaption>${
      c.png
        ? `<img src="data:image/png;base64,${c.png.toString("base64")}" style="width:${width}px">`
        : `<div class="none">no ${c.variant} fence</div>`
    }</figure>`;
  await page.setContent(`<!doctype html><style>
    body { margin: 0; font: 12px/1.4 system-ui, sans-serif; background: #fff; color: #333; }
    #grid { display: inline-grid; grid-template-columns: repeat(${columns}, ${width}px); gap: 8px; padding: 8px; background: #d4d4d4; }
    h1 { grid-column: 1 / -1; margin: 0; font-size: 12px; font-weight: 600; }
    figure { margin: 0; } figcaption { padding: 0 0 2px; color: #555; }
    img { display: block; outline: 1px solid #aaa; } .none { padding: 16px; background: #eee; color: #777; }
  </style><div id="grid"><h1>${label.replace(/</g, "&lt;")}</h1>${cells.map(img).join("")}</div>`);
  const png = await page.locator("#grid").screenshot();
  await page.close();
  return png;
}

// ---------------------------------------------------------------- main

function findChrome() {
  return (
    lookupChrome() ??
    fail("no Chromium found; set CHROME_PATH or put chromium / google-chrome on PATH")
  );
}

/**
 * One browser bundle mounting every target's preview (`__mount(i)` for the
 * i-th module). When it fails, each module is bundled alone so the error
 * lands on its own target; those targets map to null.
 *
 * @returns {Promise<{ js: string | null; index: number }[]>} Per module, in order.
 */
async function bundleAll(modules) {
  try {
    const js = await bundle({ modules, glue: GLUE(modules.length), platform: "browser" });
    return modules.map((_, index) => ({ js, index }));
  } catch {
    const out = [];
    for (const [i, module] of modules.entries()) {
      try {
        out.push({
          js: await bundle({ modules: [module], glue: GLUE(1), platform: "browser" }),
          index: 0,
        });
      } catch (e) {
        console.error(
          `${targetsWithModules[i].label}: React preview failed to bundle\n${e instanceof Error ? e.message : e}`,
        );
        out.push({ js: null, index: 0 });
      }
    }
    return out;
  }
}

ensureCss();
const targetsWithModules = variants.includes("react")
  ? targets.filter((t) => t.module !== undefined)
  : [];
const bundles = new Map(
  (await bundleAll(targetsWithModules.map((t) => t.module))).map((b, i) => [
    targetsWithModules[i],
    b,
  ]),
);
const failed = [...bundles.values()].some((b) => b.js === null);

const browser = await chromium.launch({ executablePath: findChrome() });
const outDir = join(tmpdir(), "aortl-render");

try {
  const cellsOf = targets.map((target) =>
    themes.flatMap((theme) => variants.map((variant) => ({ target, theme, variant }))),
  );
  const captured = await pool(
    cellsOf.flat().map((cell) => async (local) => {
      const { target, variant, theme } = cell;
      const b = bundles.get(target);
      const present = variant === "vanilla" ? target.html !== undefined : b?.js != null;
      if (!present) return { theme, variant };
      local[theme] ??= await openPage(browser, theme);
      const result = await captureCell(local[theme], {
        variant,
        theme,
        html: target.html,
        moduleIndex: b?.index,
        bundleJs: b?.js,
      });
      return { theme, variant, ...result };
    }),
    6,
  );
  let offset = 0;
  const cellGroups = targets.map((_, t) => captured.slice(offset, (offset += cellsOf[t].length)));
  const images = await pool(
    targets.map((target, t) => () => compose(browser, target.label, cellGroups[t])),
    6,
  );
  for (const [t, target] of targets.entries()) {
    const file =
      opts.out !== undefined
        ? resolve(process.env.INIT_CWD ?? process.cwd(), opts.out)
        : join(outDir, `${target.slug}.png`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, images[t]);
    console.log(`${target.label} → ${file}`);
    for (const cell of cellGroups[t]) {
      const tag = `  [${cell.variant} ${cell.theme}]`;
      for (const m of new Set(cell.messages ?? [])) console.log(`${tag} ${m}`);
      for (const { selector, found } of cell.probes ?? []) {
        if (found.length === 0) console.log(`${tag} ${selector}: no match`);
        found.forEach((f, i) =>
          console.log(`${tag} ${selector}[${i}] ${f.el} ${f.box}  ${f.styles.join("; ")}`),
        );
      }
    }
  }
} finally {
  await browser.close();
}
if (failed) process.exit(1);
