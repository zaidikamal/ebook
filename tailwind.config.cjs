/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#081425",
        "surface-container": "#152031",
        "surface-container-low": "#111c2d",
        "surface-container-highest": "#2a3548",
        "surface-container-lowest": "#040e1f",
        primary: "#c3c0ff",
        "primary-container": "#4f46e5",
        "on-surface-variant": "#c7c4d8",
        "outline-variant": "rgba(145, 143, 161, 0.15)",
        gold: {
          50: "#fffdf0",
          100: "#fffac2",
          200: "#ffef85",
          300: "#ffdf47",
          400: "#ffd00a",
          500: "#e6b800",
          600: "#bf9200",
          700: "#997000",
          800: "#735100",
          900: "#4d3400",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        arabic: ["Cairo", "sans-serif"],
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
