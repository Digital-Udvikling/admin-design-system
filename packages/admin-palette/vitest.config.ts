import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const adminReact = (file: string) =>
  fileURLToPath(new URL(`../admin-react/src/${file}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Source, not dist, so tests don't depend on a fresh admin-react build.
  resolve: {
    alias: [
      { find: /^@aortl\/admin-react\/internal$/, replacement: adminReact("internal.ts") },
      { find: /^@aortl\/admin-react$/, replacement: adminReact("index.ts") },
    ],
  },
  test: {
    environment: "happy-dom",
    globals: false,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
