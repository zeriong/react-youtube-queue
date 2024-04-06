/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "brand-ivory": "#F7EEDD",
        "brand-blue-300": "#008DDA",
        "brand-blue-200": "#41C9E2",
        "brand-blue-100": "#ACE2E1",
      }
    },
  },
  plugins: [],
}