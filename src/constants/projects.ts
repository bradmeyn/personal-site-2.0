export type ProjectId = "costbase" | "embark" | "sage";

export type Project = {
  id: ProjectId;
  name: string;
  /** One line: what it is, for whom. */
  summary: string;
  /** A short paragraph on what it does. */
  description: string;
  highlights: string[];
  stack: string[];
  /** Public repository. Omitted for private projects. */
  repository?: string;
  /** Live site, when there is one. */
  url?: string;
  /** Brand colour token name from global.css, used for the logo glow. */
  color: string;
};

export const PROJECTS: Project[] = [
  {
    id: "sage",
    name: "Sage",
    summary: "The practice platform for financial advisers.",
    description:
      "Clients, pipeline, modelling and advice documents in one place. Most of a Statement of Advice is already written by the time an adviser opens it.",
    highlights: [
      "One record per household: partners, finances, goals and every conversation",
      "Retirement and cashflow modelling with Monte Carlo ranges",
      "Advice documents with AI drafting, compliance checks and online acceptance",
    ],
    stack: ["TanStack Start", "React", "Drizzle", "PostgreSQL", "Better Auth"],
    color: "var(--color-sage)",
  },
  {
    id: "costbase",
    name: "Costbase",
    summary: "Capital gains tax tracking for Australian share portfolios.",
    description:
      "Keeps every parcel with its cost base and acquisition date, then produces what you need at tax time without a spreadsheet.",
    highlights: [
      "Realised gains split short and long term, with the 50% CGT discount applied",
      "Unrealised gains by FIFO tax lot",
      "AMIT statement imports and PDF tax reports",
    ],
    stack: ["SvelteKit", "Svelte 5", "Drizzle", "PostgreSQL", "LayerChart"],
    repository: "https://github.com/bradmeyn/costbase",
    color: "var(--color-costbase)",
  },
  {
    id: "embark",
    name: "Embark",
    summary: "A trip planner that maps your itinerary day by day.",
    description:
      "Plan the days, hotels, flights and travel between them, see the route on a map, and share the trip with the people coming along.",
    highlights: [
      "AI travel agent that drafts a whole itinerary from a prompt",
      "Map of each day with driving routes between stops",
      "Collaborators, share links and a packing list",
    ],
    stack: ["SvelteKit", "Remote functions", "Drizzle", "PostgreSQL", "Leaflet"],
    repository: "https://github.com/bradmeyn/embark",
    color: "var(--color-embark)",
  },
];
