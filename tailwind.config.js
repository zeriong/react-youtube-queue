/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "brand-ivory": "#F8F6E3",
        "brand-blue-300": "#7AA2E3",
        "brand-blue-200": "#6AD4DD",
        "brand-blue-100": "#97E7E1",
      }
    },
  },
  plugins: [],
}