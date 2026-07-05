/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#15151c",
        cloud: "#f7f8fb",
        mint: "#2dd4bf",
        coral: "#fb7185",
        gold: "#f59e0b",
        skybrand: "#38bdf8",
      },
      boxShadow: {
        glass: "0 20px 70px rgba(15, 23, 42, 0.14)",
      },
    },
  },
  plugins: [],
};
