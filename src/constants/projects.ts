export type Project = {
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  repository: string;
};

export const PROJECTS: Project[] = [
  {
    title: "MoneyKit",
    image: "assets/images/projects/moneykit.jpg",
    description:
      "A collection of financial tools to help make financial planning easier.",
    tech: ["TypeScript", "SvelteKit", "Tailwind", "Chart.js"],
    link: "https://moneykit.au",
    repository: "https://github.com/bradmeyn/moneykit",
  },
];
