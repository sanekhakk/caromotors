/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a', // Dark theme capability
        accent: '#e11d48',  // Caromotors brand color (red-ish)
      }
    },
  },
  plugins: [],
}