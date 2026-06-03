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
      title: "Admin design system",
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
    // The `:::example` React previews are emitted as virtual modules during the
    // MDX transform (see plugins/example/), so Vite's cold dep scanner never
    // sees their imports. Left to lazy discovery, the first preview-bearing page
    // makes Vite re-optimize mid-load and bump the optimize `browserHash`, which
    // invalidates the already-loaded `react/jsx-dev-runtime?v=<hash>` the previews
    // were hydrating against — surfacing as "jsxDEV is not a function" on every
    // React example. Pinning the previews' full dependency surface here keeps the
    // hash stable from startup. @astrojs/react already pre-includes react /
    // react-dom; this list covers everything the previews reach through
    // `@aortl/admin-react` (Base UI + clsx) and the example import blocks.
    optimizeDeps: {
      include: [
        "@base-ui/react/button",
        "@base-ui/react/checkbox",
        "@base-ui/react/dialog",
        "@base-ui/react/field",
        "@base-ui/react/input",
        "@base-ui/react/radio",
        "@base-ui/react/radio-group",
        "@base-ui/react/select",
        "@base-ui/react/switch",
        "@base-ui/react/tabs",
        "@base-ui/react/tooltip",
        "@tabler/icons-react",
        "@astrojs/starlight/components",
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
      },
    },
  },
});
