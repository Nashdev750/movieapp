/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
};