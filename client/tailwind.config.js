/* eslint-env node */
/* global module */


module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // add this
  },
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#60a5fa', // light blue
          500: '#2563eb', // main blue
          600: '#1d4ed8', // darker blue
          700: '#1e40af', // even darker
        },
      },
    },
  },
  plugins: [],
};