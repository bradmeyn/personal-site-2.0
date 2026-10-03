import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "@/lib/posts";
import { SITE } from "@/constants/site";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name}: Articles`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.outline,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/articles/${post.id}/`,
    })),
    customData: "<language>en-au</language>",
  });
}
