/**
 * Serves the scoped `_ao-` bundle from admin-css *source* so React previews
 * hot-reload without the Tailwind CLI + wrap-scoped watchers writing to dist.
 *
 * Import `@aortl/admin-css/src/admin.css?scoped`: `@tailwindcss/vite` compiles
 * it like any CSS root (and watches its imports), then this plugin runs
 * `wrap()` on the result and puts it in `@layer admin`, the equivalent of
 * `@import "@aortl/admin-css/admin.scoped.css" layer(admin)`.
 */
import { wrap } from "../../../packages/admin-css/scripts/wrap-scoped.mjs";

const SCOPED_QUERY = /[?&]scoped\b/;

/** @returns {import("vite").Plugin} */
export default function adminScopedPlugin() {
  return {
    name: "admin-scoped",
    // Normal order: after `@tailwindcss/vite` (pre) and `vite:css`, before
    // `vite:css-post` turns the CSS into a JS module.
    transform: {
      filter: { id: SCOPED_QUERY },
      handler(code, id) {
        if (!id.split("?")[0].endsWith(".css")) return null;
        // The docs register the same faces from fonts.css; a copy here would be
        // re-parsed on every HMR update and flash fallback text.
        const css = code.replace(/@font-face\s*\{[^}]*\}/g, "");
        return { code: `@layer admin {\n${wrap(css)}\n}\n`, map: null };
      },
    },
  };
}
