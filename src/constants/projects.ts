export type Project = {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  repository: string;
};

export const PROJECTS: Project[] = [
  {
    title: "MoneyKit",

    description:
      "A collection of financial tools to help make financial planning easier.",
    tech: ["TypeScript", "SvelteKit", "Tailwind", "Chart.js"],
    link: "https://moneykit.au",
    repository: "https://github.com/bradmeyn/moneykit",
  },
  {
    title: "Embark",

    description: "Trip itinerary with AI intergration I made to plan holidays.",
    tech: [
      "TypeScript",
      "SvelteKit",
      "Tailwind",
      "OpenAI",
      "Drizzle",
      "PostgreSQL",
    ],
    repository: "https://github.com/bradmeyn/embark",
  },
  {
    title: "CRM",

    description:
      "A mock financial advisor CRM project I use to keep up to date with my React & .NET skills.",
    tech: [
      "TypeScript",
      "React",
      ".NET Core",
      "Tailwind",
      "Entity Framework",
      "Tanstack Query",
    ],
    repository: "https://github.com/bradmeyn/crm-api",
  },
  {
    title: "Portfolio Pro",

    description:
      "A tool I made to track capital gains on my investments and estimate tax liability.",
    tech: ["TypeScript", "SvelteKit", "Tailwind", "Drizzle", "PostgreSQL"],
    repository: "https://github.com/bradmeyn/portfolio-pro",
  },
];
