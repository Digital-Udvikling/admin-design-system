import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import remarkExample from "./plugins/example/index.mjs";
import virtualPreviewsPlugin from "./plugins/example/virtual-previews.mjs";

export default defineConfig({
  site: "https://digital-udvikling.github.io",
  base: "/admin-design-system/",
  markdown: {
    remarkPlugins: [remarkDirective, remarkExample],
  },
  integrations: [
    react(),
    starlight({
      title: "admin design system",
      customCss: ["./src/styles/global.css"],
      editLink: {
        baseUrl: "https://github.com/Digital-Udvikling/admin-design-system/edit/main/apps/docs/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Digital-Udvikling/admin-design-system",
        },
      ],
      sidebar: [
        { label: "Getting Started", items: [{ autogenerate: { directory: "getting-started/" } }] },
        { label: "Basics", items: [{ autogenerate: { directory: "basics/" } }] },
        { label: "Components", items: [{ autogenerate: { directory: "components/" } }] },
        { label: "Modules", items: [{ autogenerate: { directory: "modules/" } }] },
        { label: "Contributing", items: [{ autogenerate: { directory: "contributing/" } }] },
      ],
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss(), virtualPreviewsPlugin()],
    resolve: {
      alias: {
        "@aortl/admin-react": fileURLToPath(
          new URL("../../packages/admin-react/src/index.ts", import.meta.url),
        ),
        "@docs": fileURLToPath(new URL("./src", import.meta.url)),
        "@example": fileURLToPath(new URL("./plugins/example", import.meta.url)),
      },
    },
  },
});
