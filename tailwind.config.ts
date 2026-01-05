import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F7",
        sand: "#F5F3EF",
        charcoal: "#1a1a1a",
        stone: "#525252",
        terracotta: "#C4846C",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-nanum)", "Georgia", "serif"],
      },
      letterSpacing: {
        "extra-wide": "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
