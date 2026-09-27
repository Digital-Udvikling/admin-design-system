import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      /** Position within the sidebar group; unordered pages follow, by title. */
      sidebar: z.object({ order: z.number() }).optional(),
    }),
  }),
};
