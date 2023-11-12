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
    title: "Workshop",
    description:
      "A trello-esq kanban app for managing side-project tasks. Goal was to demonstrate a grasp of React and build a Typescript API I can use for trying other frameworks.",
    tech: [
      "React",
      "Typescript",
      "Tailwind",
      "Node",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    desktopImage: "/assets/workshop-desktop.png",
    mobileImage: null, // No mobile image provided in the HTML
    link: "https://workshopbrad.netlify.app/",
    repo: "https://github.com/bradmeyn/workshop",
  },
  {
    title: "Clientbook",
    description:
      "The first fullstack application I built, showing it's age a bit now. A CRM for managing clients and related jobs. Serve will take a bit to spin up as it's hosted for free.",
    tech: ["Typescript", "Bootstrap", "Node", "Express", "MongoDB"],
    desktopImage: "/assets/clientbook-desktop.jpg",
    mobileImage: "/assets/clientbook-mobile.jpg",
    link: "https://client-book.herokuapp.com", // Provided link seems to be incorrect, check the actual live site URL
    repo: "https://github.com/bradmeyn/clientBook",
  },
  {
    title: "Watchflix",
    description:
      "Movie search app using the TMDB API featuring some cool carousels. Built to try out Next.js. Backend coming eventually.",
    tech: ["Next.JS", "Tailwind", "Typescript"],
    desktopImage: "/assets/watchflix-desktop.jpg",
    mobileImage: "/assets/watchflix-mobile.jpg",
    link: "https://watchflix-five.vercel.app/",
    repo: "https://github.com/bradmeyn/watchflix",
  },
  {
    title: "Investment Growth Calculator",
    description:
      "Interactive tool to project future value of an investment. The very first project I built and hosted on the web.",
    tech: ["HTML", "CSS", "Sass", "Javascript"],
    desktopImage: "/assets/investment-calc-desktop.jpg",
    mobileImage: "/assets/investment-calc-mobile.jpg",
    link: "https://investment-growth-calculator.netlify.app/",
    repo: "https://github.com/bradmeyn/compound_interest_calculator",
  },
  {
    title: "Personal Site",
    description:
      "This is my personal portfolio you are currently visiting. Just a simple static site built with HTML, CSS, and Javascript.",
    tech: ["HTML", "CSS", "Sass", "Javascript"],
    desktopImage: "/assets/portfolio-desktop.jpg",
    mobileImage: "/assets/portfolio-mobile.jpg",
    link: null, // No live link provided in the HTML, so set to null
    repo: "https://github.com/bradmeyn/personal_portfolio",
  },
];
