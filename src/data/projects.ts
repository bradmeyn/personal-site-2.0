export type Project = {
  title: string;
  description: string;
  featured: boolean;
  link: string;
  tech: string[];
  repository: string;
  mobileImage?: string;
  desktopImage?: string;
};

export const projects = [
  {
    title: "WealthKit",
    description:
      "A collection of financial tools for managing money & investments. ",
    tech: ["SvelteKit", "Tailwind", "Typescript", "Node"],
    desktopImage: "/assets/wealthkit-desktop.jpg",
    mobileImage: "/assets/wealthkit-mobile.jpg",
    link: "https://bradmeyn-wealthkit.vercel.app/",
    repository: "https://github.com/bradmeyn/wealthkit",
    featured: true,
  },

  {
    title: "Nextflik",
    description:
      "A simple movie discovery app using the TMDB API & React w/Tanstack Router.",
    tech: ["React", "Tailwind", "Typescript", "Node"],
    desktopImage: "/assets/trackflix-desktop.jpg",
    mobileImage: "/assets/trackflix-mobile.jpg",
    link: "https://bradmeyn-nextflik.netlify.app/",
    repository: "https://github.com/bradmeyn/nextflik",
    featured: true,
  },
  {
    title: "ClientBook",
    description:
      "My first full-stack app. A CRM for managing clients and projects. Server will take a second to boot.",
    tech: ["Typescript", "Bootstrap", "Node", "MongoDB"],
    desktopImage: "/assets/clientbook-desktop.jpg",
    mobileImage: "/assets/clientbook-mobile.jpg",
    link: "https://clientbook.onrender.com/",
    repository: "https://github.com/bradmeyn/clientBook",
    featured: true,
  },
  {
    title: "Drag & Drop",
    description: "Testing dnd kit with a Trello-style drag & drop app.",
    tech: ["React", "Tailwind", "Typescript", "Node"],
    link: "https://bradmeyn-drag-and-drop.netlify.app",
    repository: "https://github.com/bradmeyn/react-drag--drop",
    featured: false,
  },
];
