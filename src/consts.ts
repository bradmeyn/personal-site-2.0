// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface Project {
  title: string;
  description: string;
  link: string;
  image: string;
  technology: string[];
}

export const SITE_TITLE = "B Meyn - Web Developer";
export const SITE_DESCRIPTION =
  "The personal website for software developer, Brad Meyn.";

export const projects = [
  {
    title: "B Meyn",
    description: "My personal website.",
  },
];

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];
const socialLinks = [
  {
    href: "https://github.com/bradmeyn",
    label: "GitHub",
    icon: "fab fa-github",
  },
  {
    href: "https://codepen.io/bradmeyn",
    label: "Codepen",
    icon: "fab fa-codepen",
  },
  {
    href: "https://linkedin.com/in/bradmeyn",
    label: "LinkedIn",
    icon: "fab fa-linkedin-in",
  },
];
