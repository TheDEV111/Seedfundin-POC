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
        olive: {
          DEFAULT: "var(--color-olive-primary)",
          deep: "var(--color-olive-deep)",
          muted: "var(--color-olive-muted)",
        },
        surface: {
          white: "var(--color-white)",
          offwhite: "var(--color-off-white)",
        },
        charcoal: "var(--color-charcoal-text)",
      },
    },
  },
  plugins: [],
};
export default config;
