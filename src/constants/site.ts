export const SITE = {
  name: "Bradley Meyn",
  shortName: "Brad Meyn",
  url: "https://www.bradmeyn.com",
  title: "Bradley Meyn (Brad Meyn) | Full-stack developer, Newcastle",
  description:
    "Bradley (Brad) Meyn is a full-stack developer in Newcastle, Australia, building web apps with TypeScript, SvelteKit and React. Projects include Sage, Costbase and Embark.",
  locale: "en_AU",
  location: { locality: "Newcastle", region: "NSW", country: "AU" },
  github: "https://github.com/bradmeyn",
  linkedin: "https://www.linkedin.com/in/bradmeyn",
  /**
   * Every profile that's about you. Each one becomes a `sameAs` link in the
   * structured data, which helps search engines tie them all to one person.
   * Add new ones here as you create them (X, Bluesky, dev.to, YouTube...).
   */
  profiles: [
    "https://github.com/bradmeyn",
    "https://www.linkedin.com/in/bradmeyn",
    "https://bsky.app/profile/brad-meyn.bsky.social",
  ],
  themeColor: "#0d1315",
} as const;
