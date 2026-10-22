import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { articleImages } from "./integrations/og-images.mjs";

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
    // Pre-bundle these with the rest of Svelte. If Vite discovers them later and
    // re-optimises mid-session, they can end up on a separate copy of Svelte's
    // runtime, and Tweens (the Lighthouse rings) silently stop updating in dev.
    optimizeDeps: {
      include: ["svelte/motion", "svelte/easing"],
    },
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
    articleImages(),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  adapter: cloudflare({ imageService: "compile" }),
});
