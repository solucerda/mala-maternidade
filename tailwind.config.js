/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#F7F8F5',
        ink: '#2B2420',
        plum: {
          DEFAULT: '#5B3A56',
          dark: '#3F2740',
          light: '#7A5675',
        },
        marigold: {
          DEFAULT: '#E8A33D',
          dark: '#C6842A',
        },
        sage: {
          DEFAULT: '#7C9885',
          light: '#E4EBE5',
        },
        rose: {
          DEFAULT: '#C97B84',
          light: '#F3E2E4',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Karla', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
};
