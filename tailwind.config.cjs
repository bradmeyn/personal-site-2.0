import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: colors.rose[500],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "800px",
        },
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(50px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          from: { opacity: "0", transform: "translateY(-30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeRight: {
          from: { opacity: "0", transform: "translateX(50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-in-out forwards",
        "fade-down": "fadeDown 0.6s ease-in-out forwards",
        "fade-right": "fadeRight 0.6s ease-in-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
