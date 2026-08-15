/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005154',
          light: '#E6F4F1',
          dark: '#00383B',
        },
        alsalim: {
          teal: '#005154',
          gold: '#D4AF37',
          purple: '#714B67',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        heading: ['Cairo', 'sans-serif'],
        body: ['Tajawal', 'Readex Pro', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
