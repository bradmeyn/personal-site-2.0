export type Project = {
  title: string;
  description: string;
  repository: string;
};

export const PROJECTS: Project[] = [
  {
    title: "MoneyKit",
    description:
      "A collection of financial tools & a personal dashboard to track finances.",
    repository: "https://github.com/bradmeyn/moneykit",
  },
  {
    title: "Embark",
    description: "Trip itinerary builder with AI intergrations.",
    repository: "https://github.com/bradmeyn/embark",
  },
  {
    title: "Sage CRM",
    description: "Modern financial advisor CRM.",
    repository: "https://github.com/bradmeyn/sage-crm-svelte",
  },
];
