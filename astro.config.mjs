import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://www.bradmeyn.com",
  trailingSlash: "always",
  redirects: {
    "/posts/sveltekit-is-great-and-nobody-is-using-it/": "/articles/sveltekit-framework-for-the-ai-age/",
    "/posts/sveltekit-framework-for-the-ai-age/": "/articles/sveltekit-framework-for-the-ai-age/",
    "/posts/astro-cloudflare-marketing-site/": "/articles/astro-cloudflare-marketing-site/",
  },
  build: {
    inlineStylesheets: "always",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      wrap: true,
    },
  },

  integrations: [
    mdx(),
    svelte(),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  adapter: cloudflare({ imageService: "compile" }),
});
