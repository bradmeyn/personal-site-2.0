import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),

    tags: z.array(z.string()),
    // In frontmatter, dates written without quotes around them are interpreted as Date objects
    date: z.date(),
    // You can also transform a date string (e.g. "2022-07-08") to a Date object
    // publishDate: z.string().transform((str) => new Date(str)),
    // Advanced: Validate that the string is also an email
  }),
});

// This key should match your collection directory name in "src/content"
export const collections = {
  posts,
};

// export type Article = z.infer<typeof articlesCollection.schema>;
