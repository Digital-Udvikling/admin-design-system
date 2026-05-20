/**
 * Vite plugin + shared registry for `:::example` React previews.
 *
 * The remark plugin (`./index.mjs`) emits one virtual TSX module per preview
 * so each can be imported into the MDX page and hydrated as its own React
 * island. The whole preview is wrapped in a single default-exported function
 * component — Astro renders that component through one React SSR pass and
 * hydrates the same tree on the client, which keeps context-publishing
 * primitives (`Field`, `RadioGroup`, `Select.Root`, `Tabs.Root`) wired to
 * their descendants.
 *
 * IDs look like `virtual:example-preview/<sha1>.tsx`. We intentionally do
 * NOT prefix the resolved id with `\0`: Vite's `createFilter` (and therefore
 * the built-in `vite:esbuild` transform) skips `\0`-prefixed modules, and
 * without that transform our TSX source would reach import-analysis with
 * raw JSX in it. The `.tsx` suffix is what cues vite:esbuild to run the
 * automatic JSX transform.
 */
const previews = new Map();

const PREFIX = "virtual:example-preview/";

/** @param {string} id */
function isPreviewId(id) {
  return id.startsWith(PREFIX) && id.endsWith(".tsx");
}

/**
 * Register a preview source. Idempotent: re-registering the same id with the
 * same source is a no-op, which keeps HMR stable when an MDX file is
 * re-transformed without content changes.
 *
 * @param {string} id  module id, e.g. `virtual:example-preview/<sha1>.tsx`
 * @param {string} source TSX source
 */
export function registerPreview(id, source) {
  previews.set(id, source);
}

/**
 * Build the importable id from a content hash.
 *
 * @param {string} hash
 */
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
