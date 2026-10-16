import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const EXTERNAL = ["react", "react-dom", "@aortl/admin-react", "@tanstack/match-sorter-utils"];

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
  ],
  build: {
    lib: {
      entry: { index: resolve(import.meta.dirname, "src/index.ts") },
      formats: ["es"],
      // One file per source module, so each keeps its own "use client" directive.
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      external: (id) => EXTERNAL.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
    sourcemap: true,
    minify: false,
  },
});
