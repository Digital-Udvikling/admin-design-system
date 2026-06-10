/**
 * Vite plugin + registry for the `:::example` preview modules
 * (`virtual:example-preview/<sha1>.tsx`) emitted by `./index.mjs` — one
 * default-exported component per preview, hydrated as a single React island
 * (one SSR pass, so Base UI context reaches descendants).
 *
 * Resolved ids are intentionally NOT `\0`-prefixed: Vite's `createFilter` (and
 * thus `vite:esbuild`) skips `\0` modules, leaving raw JSX at import-analysis.
 * The `.tsx` suffix is what cues the JSX transform.
 */
const previews = new Map();

const PREFIX = "virtual:example-preview/";

/** @param {string} id */
function isPreviewId(id) {
  return id.startsWith(PREFIX) && id.endsWith(".tsx");
}

/**
 * Idempotent — re-registration on MDX re-transform keeps HMR stable.
 *
 * @param {string} id
 * @param {string} source
 */
export function registerPreview(id, source) {
  previews.set(id, source);
}

/** @param {string} hash */
export function previewId(hash) {
  return `${PREFIX}${hash}.tsx`;
}

/** @returns {import("vite").Plugin} */
export default function virtualPreviewsPlugin() {
  return {
    name: "example-virtual-previews",
    enforce: "pre",
    resolveId(id) {
      if (isPreviewId(id)) return id;
      return null;
    },
    load(id) {
      if (!isPreviewId(id)) return null;
      const source = previews.get(id);
      if (source === undefined) {
        throw new Error(`[example] no virtual preview registered for ${id}`);
      }
      return { code: source, map: null };
    },
  };
}
