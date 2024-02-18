/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'primary': '#252354',
        'primary-hover': '#323161',
        'secondary': '#d4d4e6',
      }
    },
  },
  plugins: [],
}

