import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  vite: {
    resolve: {},
  },
  markdown: {
    shikiConfig: {
      wrap: true,
    },
  },
  integrations: [mdx(), sitemap(), tailwind()],
});
