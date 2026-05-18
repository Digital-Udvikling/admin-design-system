import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "@aortl/admin",
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Vanilla CSS", slug: "getting-started/vanilla" },
            { label: "React", slug: "getting-started/react" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "Buttons", slug: "components/buttons" },
            { label: "Inputs", slug: "components/inputs" },
            { label: "Cards", slug: "components/cards" },
          ],
        },
      ],
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
