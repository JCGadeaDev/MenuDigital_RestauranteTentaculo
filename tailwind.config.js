/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0B3954',
        'brand-blue': '#00A6FB',
        'brand-sky': '#B3E5FC',
        'brand-sun': '#FFD23F',
        'brand-cream': '#FFF8E7',
      },
    },
  },
  plugins: [],
}
