/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        seymour: ['Seymour One', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
