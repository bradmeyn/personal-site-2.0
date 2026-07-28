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
    description: "Trip itinerary with AI intergration I made to plan holidays.",
    repository: "https://github.com/bradmeyn/embark",
  },
  {
    title: "Sage CRM",
    description:
      "A mock financial advisor CRM project I made to try out TanStack Start (cutting edge React framework)",
    repository: "https://github.com/bradmeyn/sage-crm",
  },
];
