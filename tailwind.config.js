/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Claremont McKenna cardinal + gold
        brand: {
          50: '#fbf3f4', 100: '#f5e1e4', 200: '#e9bfc6', 300: '#d68f9b',
          400: '#c0606f', 500: '#a8384a', 600: '#981a31', 700: '#7e1529',
          800: '#661322', 900: '#4f101b', 950: '#2b070d',
        },
        gold: { 300: '#e4d29b', 400: '#d6bc6e', 500: '#c4a24c', 600: '#a6863a', 700: '#7f6629' },
        paper: { DEFAULT: '#f7f3ea', card: '#fffdf8', dark: '#14110e', 'dark-card': '#1c1814' },
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Garamond', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
