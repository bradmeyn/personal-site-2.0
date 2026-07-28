import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    outline: z.string(),
    tags: z.array(z.string()),
    // Dates written unquoted in frontmatter are parsed as Date objects
    date: z.date(),
  }),
});

export const collections = {
  posts,
};
