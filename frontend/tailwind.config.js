/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#2E7D32",         // deep grass green
        "pitch-dark": "#1B5E20",  // darker grass
        goal: "#FBC02D",          // goal‑yellow accent
      },
    },
  },
  plugins: [],
};
