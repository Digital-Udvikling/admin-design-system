import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A no-build bundle: React, Base UI and admin-react inlined. The entry stays small and loads the
// palette chunk on first open.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "dist/standalone",
    // The main build writes the .d.ts files here first.
    emptyOutDir: false,
    lib: {
      entry: { palette: resolve(import.meta.dirname, "src/standalone/palette.ts") },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      output: { chunkFileNames: "[name]-[hash].js" },
    },
    sourcemap: true,
    minify: true,
  },
});
