export interface Project {
  title: string;
  description: string;
  link: string;
  tech: string[];
  repo: string;
  mobileImage?: string;
  desktopImage: string;
}

export const projects = [
  {
    title: "WealthKit",
    description:
      "A collection of financial tools for managing money & investments. ",
    tech: ["SvelteKit", "Tailwind", "Typescript", "Node"],
    desktopImage: "/assets/wealthkit-desktop.jpg",
    mobileImage: "/assets/wealthkit-mobile.jpg",
    link: "https://wealthkit-git-main-bradmeyn.vercel.app/",
    repo: "https://github.com/bradmeyn/wealthkit",
  },
  {
    title: "Workshop",
    description:
      "A trello-esq kanban app for managing side-project tasks. Goal was to demonstrate a grasp of React and build a Typescript API I can use for trying other frameworks.",
    tech: ["React", "Typescript", "Tailwind", "Node", "Prisma", "PostgreSQL"],
    desktopImage: "/assets/workshop-desktop.jpg",
    mobileImage: null, // No mobile image provided in the HTML
    link: "https://workshopbrad.netlify.app/",
    repo: "https://github.com/bradmeyn/workshop",
  },
  {
    title: "ClientBook",
    description:
      "A CRM for managing clients and related jobs. Server will take a bit to spin up as it's hosted for free.",
    tech: ["Typescript", "Bootstrap", "Node", "MongoDB"],
    desktopImage: "/assets/clientbook-desktop.jpg",
    mobileImage: "/assets/clientbook-mobile.jpg",
    link: "https://clientbook.onrender.com/",
    repo: "https://github.com/bradmeyn/clientBook",
  },
  {
    title: "Trackflix",
    description:
      "Track movies you've watched and get recommendations based on your ratings. ",
    tech: [
      "NextJS",
      "Tailwind",
      "Typescript",
      "Node",
      "MySQL",
      "Drizzle",
      "PlanetScale",
    ],
    desktopImage: "/assets/watchflix-desktop.jpg",
    mobileImage: "/assets/watchflix-mobile.jpg",
    link: "https://watchflix-five.vercel.app/",
    repo: "https://github.com/bradmeyn/watchflix",
  },
];
