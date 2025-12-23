/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FACC15', // Yellow-400
          500: '#EAB308', // Yellow-500
          600: '#CA8A04', // Yellow-600
        },
        dark: {
          900: '#111827', // Gray-900
          800: '#1F2937', // Gray-800
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
