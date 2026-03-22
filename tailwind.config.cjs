/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#040810", // Deeper dark
        "surface-container": "#0d1424",
        "surface-container-low": "#080e1a",
        "surface-container-highest": "#1c263b",
        "surface-container-lowest": "#02050b",
        primary: "#d4af37", // True Gold
        "primary-container": "#b8860b", 
        "on-surface-variant": "#94a3b8",
        "outline-variant": "rgba(212, 175, 55, 0.1)", // Gold outline
        gold: {
          50: "#fffdeb",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        arabic: ["'IBM Plex Sans Arabic'", "sans-serif"],
        amiri: ["Amiri", "serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
}
