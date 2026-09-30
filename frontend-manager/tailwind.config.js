/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        movistar: {
          blue: "#019DF4",
          navy: "#00337A",
          "blue-dark": "#0B2739",
          green: "#5CB615",
          gray: "#F4F4F4"
        }
      }
    }
  },
  plugins: []
};
