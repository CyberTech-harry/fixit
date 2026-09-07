import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4a90e2",
          darker: "#357abd",
          light: "#ffffff",
          dark: "#333333",
          medium: "#555555",
        },
        teal: {
          50: "#f0f6fc",
          100: "#e1effe",
          200: "#c3ddfd",
          300: "#9ac2f9",
          400: "#6ba3f5",
          500: "#5b9ee8",
          600: "#4a90e2", // --primary-color: #4a90e2
          700: "#357abd", // --primary-color-darker: #357abd
          800: "#28609c",
          900: "#183b60",
          950: "#0e233b",
        },
        brand: {
          50: "#f0f6fc",
          100: "#e1effe",
          200: "#c3ddfd",
          300: "#9ac2f9",
          400: "#6ba3f5",
          500: "#4a90e2",
          600: "#357abd",
          700: "#28609c",
          800: "#1e4a7a",
          900: "#183b60",
          950: "#0e233b",
        },
      },
      fontFamily: {
        sans: [
          "'Segoe UI'",
          "Tahoma",
          "Geneva",
          "Verdana",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
