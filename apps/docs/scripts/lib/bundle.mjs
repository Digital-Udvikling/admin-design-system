// Bundles docs preview modules with Rolldown — the bundler and Oxc transform behind
// the docs' Vite — resolving imports the way the docs' Vite config does.

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { rolldown } from "rolldown";

const DOCS_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REPO_ROOT = join(DOCS_ROOT, "..", "..");

/** Mirrors `import.meta.env.BASE_URL` in astro.config.mjs. */
export const BASE_URL = "/admin-design-system/";

const EXAMPLE_ID = /^example:(\d+)$/;
const GLUE_PATH = join(DOCS_ROOT, "__bundle_glue.tsx");
// CJS deps inlined into ESM (react-dom/server) `require` node builtins; ESM has no `require`.
const NODE_REQUIRE = `import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);`;

/**
 * @typedef {object} PreviewModule
 * @property {string} source      TSX source; may import `@aortl/admin-react` (source, not dist) and the docs' deps.
 * @property {string} resolveDir  Directory relative imports in `source` resolve from.
 */

/**
 * Bundles `modules` behind `glue`, a TSX module that imports module `i` as
 * `"example:<i>"`. Browser output is an IIFE. Node output is ESM that imports
 * nothing but node builtins, so it runs from any path (write it to a temp file
 * and `import()` it).
 *
 * Throws on failure with Rolldown's diagnostics, which name the failing module
 * as `<resolveDir>/__example_<i>.tsx`.
 *
 * @param {{ modules: PreviewModule[]; glue: string; platform: "browser" | "node" }} options
 * @returns {Promise<string>} The bundled JavaScript.
 */
export async function bundle({ modules, glue, platform }) {
  // Paths beside each page, so bare and relative imports resolve as they do from the MDX.
  const paths = modules.map((m, i) => join(m.resolveDir, `__example_${i}.tsx`));
  const sources = new Map([[GLUE_PATH, glue], ...paths.map((p, i) => [p, modules[i].source])]);

  const build = await rolldown({
    input: GLUE_PATH,
    platform,
    logLevel: "silent",
    tsconfig: false,
    resolve: {
      alias: {
        "@aortl/admin-react": join(REPO_ROOT, "packages", "admin-react", "src", "index.ts"),
        "@docs": join(DOCS_ROOT, "src"),
      },
    },
    transform: {
      target: "es2023",
      jsx: { runtime: "automatic" },
      define: {
        "import.meta.env.BASE_URL": JSON.stringify(BASE_URL),
        // Development React: its console warnings are part of what a render reports.
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    },
    moduleTypes: { ".css": "empty" },
    plugins: [
      {
        name: "docs-previews",
        resolveId(id) {
          const m = EXAMPLE_ID.exec(id);
          if (m) return paths[Number(m[1])];
          if (sources.has(id)) return id;
          return null;
        },
        load(id) {
          const code = sources.get(id);
          return code === undefined ? null : { code, moduleType: "tsx" };
        },
      },
    ],
  });
  try {
    const { output } = await build.generate({
      format: platform === "browser" ? "iife" : "esm",
      banner: platform === "node" ? NODE_REQUIRE : undefined,
    });
    return output[0].code;
  } finally {
    await build.close();
  }
}
