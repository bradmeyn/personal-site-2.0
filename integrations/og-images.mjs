import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

// Share images (1200×630) for articles. Rendered in Node after the build
// (the Cloudflare prerender runtime can't load sharp): satori lays out the
// text as SVG paths, and sharp turns that into a PNG. Nothing here ships to
// the browser.

const fontFile = (pkg, file) =>
  fs.readFileSync(path.resolve("node_modules/@fontsource", pkg, "files", file));

const FONTS = [
  { name: "Geist Mono", data: fontFile("geist-mono", "geist-mono-latin-500-normal.woff"), weight: 500 },
  { name: "Geist Mono", data: fontFile("geist-mono", "geist-mono-latin-600-normal.woff"), weight: 600 },
  { name: "Geist", data: fontFile("geist", "geist-latin-400-normal.woff"), weight: 400 },
  { name: "Geist", data: fontFile("geist", "geist-latin-500-normal.woff"), weight: 500 },
];

const COLORS = {
  bg: "#0d1315",
  tile: "#121a1d",
  fg: "#e8eef0",
  muted: "#a3afb3",
  faint: "#879499",
  accent: "#a59cff",
};

// Minimal element helper for satori. Elements without children get no
// `children` prop at all: an empty array stops satori drawing later siblings.
const h = (type, style, ...children) => ({
  type,
  props: children.length === 0 ? { style } : { style, children: children.length === 1 ? children[0] : children },
});

/** Shrink long titles so they always fit in three lines. */
function titleSize(title) {
  if (title.length <= 32) return 76;
  if (title.length <= 50) return 66;
  return 56;
}

/** Splits a title into words, with the last one's end punctuation pulled out to colour separately. */
function titleWords(title) {
  const words = title.trim().split(/\s+/);
  const last = words.pop();
  const match = last.match(/^(.*?)([.?!]?)$/);
  return [...words, { text: match[1], mark: match[2] || "." }];
}

export async function renderArticleImage({ title, date }) {
  const dateLabel = date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const tree = h(
    "div",
    {
      // Satori adds padding outside the box, so size it to 1200×630 minus the
      // padding below; otherwise the footer is pushed off the bottom.
      width: "1040px",
      height: "494px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px 64px",
      backgroundColor: COLORS.bg,
      backgroundImage: "radial-gradient(circle at 85% 0%, rgba(165,156,255,0.22), rgba(13,19,21,0) 55%)",
      fontFamily: "Geist",
    },
    // Mark and name
    h(
      "div",
      { display: "flex", alignItems: "center", gap: "18px" },
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          borderRadius: "13px",
          backgroundColor: COLORS.tile,
          border: "1px solid rgba(255,255,255,0.14)",
          fontFamily: "Geist Mono",
          fontWeight: 600,
          fontSize: "21px",
          letterSpacing: "-1px",
          color: COLORS.fg,
        },
        "BM",
        h("div", { width: "6px", height: "6px", borderRadius: "3px", backgroundColor: COLORS.accent, marginLeft: "2px", marginTop: "10px" }),
      ),
      h("div", { fontFamily: "Geist Mono", fontWeight: 500, fontSize: "28px", color: COLORS.fg, letterSpacing: "-0.5px" }, "Brad Meyn"),
    ),
    // Title, one span per word so it wraps naturally, ending in a violet full stop
    // (or the title's own ? or !, in violet).
    h(
      "div",
      {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        fontFamily: "Geist Mono",
        fontWeight: 500,
        fontSize: `${titleSize(title)}px`,
        lineHeight: 1.15,
        letterSpacing: "-2px",
        color: COLORS.fg,
        maxWidth: "1040px",
      },
      ...titleWords(title).map((word, i, words) =>
        i < words.length - 1
          ? h("span", { marginRight: `${Math.round(titleSize(title) * 0.42)}px` }, word)
          : h("span", { display: "flex" }, word.text, h("span", { color: COLORS.accent, marginLeft: `-${Math.round(titleSize(title) * 0.1)}px` }, word.mark)),
      ),
    ),
    // Footer
    h(
      "div",
      {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "26px",
        color: COLORS.muted,
      },
      h("div", {}, dateLabel),
      h("div", { color: COLORS.faint }, "bradmeyn.com"),
    ),
  );

  const svg = await satori(tree, { width: 1200, height: 630, fonts: FONTS });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

/** Reads title and date from each article's frontmatter. */
function readPosts(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .flatMap((d) => {
      const file = ["index.mdx", "index.md"].map((f) => path.join(dir, d.name, f)).find((f) => fs.existsSync(f));
      if (!file) return [];
      const front = fs.readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      const field = (name) => front.match(new RegExp(`^${name}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1];
      return [{ slug: d.name, title: field("title"), date: new Date(field("date")) }];
    });
}

/** Writes dist/client/articles/<slug>/og.png for every article after the build. */
export function articleImages() {
  return {
    name: "article-og-images",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const out = new URL("./articles/", dir);
        for (const post of readPosts(path.resolve("src/content/posts"))) {
          const png = await renderArticleImage(post);
          const target = new URL(`./${post.slug}/og.png`, out);
          fs.mkdirSync(new URL("./", target), { recursive: true });
          fs.writeFileSync(target, png);
          logger.info(`og image: /articles/${post.slug}/og.png`);
        }
      },
    },
  };
}
