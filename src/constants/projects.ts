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
      "A collection of financial tools & a personal dashboard to track finances.",
    tech: ["TypeScript", "SvelteKit", "Tailwind", "Postgresql"],

    repository: "https://github.com/bradmeyn/moneykit",
  },
  {
    title: "Embark",

    description: "Trip itinerary with AI intergration I made to plan holidays.",
    tech: ["TypeScript", "SvelteKit", "Tailwind", "Drizzle", "PostgreSQL"],
    repository: "https://github.com/bradmeyn/embark",
  },
  {
    title: "Sage CRM",
    description:
      "A mock financial advisor CRM project I made to try out TanStack Start (cutting edge React framework)",
    tech: ["TypeScript", "React", "TanStack", "Shadcn"],
    repository: "https://github.com/bradmeyn/sage-crm",
  },
];
