/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // La paleta "movistar.*" se resuelve desde CSS variables (ver globals.css),
        // lo que permite cambiar el tema completo según el tipo de usuario
        // (regular / vip / seller) reasignando esas variables por data-theme.
        movistar: {
          blue: "rgb(var(--c-blue) / <alpha-value>)",
          "blue-dark": "rgb(var(--c-blue-dark) / <alpha-value>)",
          navy: "rgb(var(--c-navy) / <alpha-value>)",
          green: "rgb(var(--c-green) / <alpha-value>)",
          purple: "rgb(var(--c-purple) / <alpha-value>)",
          gray: "rgb(var(--c-gray) / <alpha-value>)",
          "gray-med": "rgb(var(--c-gray-med) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "Arial", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 51, 122, 0.08)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 40s linear infinite"
      }
    }
  },
  plugins: []
};
