/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
        },
        sharda: {
          blue: '#4B70F5', // Approximate "Sharda" Blue
          red: '#E84D58',  // Approximate "University" Red
          yellow: '#FFB800', // Approximate "Agra" Yellow
          green: '#34A853', // Standard Google Green (or custom if needed)
        },
      },
      fontFamily: {
        sans: ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
