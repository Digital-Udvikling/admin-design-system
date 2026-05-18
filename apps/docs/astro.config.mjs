import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "aortl design system",
      customCss: ["./src/styles/global.css"],
      sidebar: [
        { label: "Getting Started", items: [{ autogenerate: { directory: "getting-started/" } }] },
        { label: "Components", items: [{ autogenerate: { directory: "components/" } }] },
      ],
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
