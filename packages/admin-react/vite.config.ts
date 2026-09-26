import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

const USE_CLIENT = /^\s*["']use client["'];?/;

/**
 * Fails the build unless every "use client" module is its own output file's entry and keeps the
 * directive, which Next.js reads per file and bundlers strip or merge away by default.
 */
function assertUseClient(): Plugin {
  return {
    name: "admin:assert-use-client",
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") continue;
        for (const id of chunk.moduleIds) {
          if (!isAbsolute(id) || !USE_CLIENT.test(readFileSync(id, "utf8"))) continue;
          if (id !== chunk.facadeModuleId || !USE_CLIENT.test(chunk.code)) {
            this.error(`${chunk.fileName} dropped the "use client" directive of ${id}`);
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test-setup.ts"],
      // Source imports are extensionless (bundler resolution); Node ESM resolution needs `.js`.
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: content.replace(/((?:from|import\()\s*["'])(\.\.?\/[^"']+?)(["'])/g, "$1$2.js$3"),
      }),
    }),
    assertUseClient(),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      // One file per source module, so each keeps its own "use client" boundary.
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      external: (id) =>
        id === "react" ||
        id === "react-dom" ||
        id.startsWith("react/") ||
        id.startsWith("react-dom/") ||
        id === "clsx" ||
        id.startsWith("@base-ui/react"),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
    sourcemap: true,
    minify: false,
  },
});
