export const externalLinks = [
  { name: "GitHub", url: "https://github.com/bradmeyn", icon: "fab fa-github" },
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/in/bradmeyn/",
    icon: "fab fa-linkedin",
  },
  {
    name: "Codepen",
    url: "https://codepen.io/bradmeyn",
    icon: "fab fa-codepen",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/brad_meyn/",
    icon: "fab fa-instagram",
  },
];

export const navLinks = [
  { name: "About", url: "/about" },
  { name: "Projects", url: "/projects" },
  { name: "Contact", url: "/contact" },
];

export type Project = {
  title: string;
  description: string;
  link: string;
  repository: string;
};

export const PROJECTS = [
  {
    title: "WealthKit",
    description:
      "A collection of financial tools to help make financial planning easier.",
    link: "https://bradmeyn-wealthkit.vercel.app/",
    repository: "https://github.com/bradmeyn/wealthkit",
  },
];
