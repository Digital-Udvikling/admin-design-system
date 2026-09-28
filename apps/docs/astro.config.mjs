import { fileURLToPath } from "node:url";
import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import adminScopedPlugin from "./plugins/admin-scoped.mjs";
import remarkExample from "./plugins/example/index.mjs";
import virtualPreviewsPlugin from "./plugins/example/virtual-previews.mjs";
import { shikiTheme } from "./src/shiki-theme";

export default defineConfig({
  site: "https://digital-udvikling.github.io",
  base: "/admin-design-system/",
  markdown: {
    // Astro 7's native Sätteri pipeline. `directive: true` enables `:::example`;
    // the example transform parses fences natively — no remark-directive needed.
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [remarkExample],
    }),
    shikiConfig: {
      theme: shikiTheme,
      transformers: [
        {
          pre(node) {
            this.addClassToHast(node, "code-block code-block-nowrap");
          },
        },
      ],
    },
  },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss(), adminScopedPlugin(), virtualPreviewsPlugin()],
    // The `:::example` previews are virtual modules Vite's cold dep scanner never
    // sees; lazily discovering their deps re-optimizes mid-load, bumping the
    // optimize `browserHash` and invalidating the loaded `react/jsx-dev-runtime`
    // ("jsxDEV is not a function"). Pin their full dep surface to keep it stable.
    optimizeDeps: {
      include: [
        "@base-ui/react/avatar",
        "@base-ui/react/button",
        "@base-ui/react/checkbox",
        "@base-ui/react/dialog",
        "@base-ui/react/field",
        "@base-ui/react/input",
        "@base-ui/react/number-field",
        "@base-ui/react/radio",
        "@base-ui/react/radio-group",
        "@base-ui/react/select",
        "@base-ui/react/switch",
        "@base-ui/react/tabs",
        "@base-ui/react/toggle",
        "@base-ui/react/tooltip",
        "@tabler/icons-react",
        "clsx",
      ],
    },
    resolve: {
      alias: {
        "@aortl/admin-react": fileURLToPath(
          new URL("../../packages/admin-react/src/index.ts", import.meta.url),
        ),
        "@docs": fileURLToPath(new URL("./src", import.meta.url)),
        "@example": fileURLToPath(new URL("./plugins/example", import.meta.url)),
        "@changelog": fileURLToPath(new URL("../../CHANGELOG.md", import.meta.url)),
      },
    },
  },
});
