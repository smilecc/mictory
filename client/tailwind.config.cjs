/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/renderer/index.html", "./src/renderer/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#2F343D",
        "app-dark": "#202225",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
