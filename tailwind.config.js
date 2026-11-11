/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CMC-inspired palette: cardinal red + gold
        brand: {
          50: '#fdf2f3', 100: '#fbe3e5', 200: '#f6c6cb', 300: '#ee9aa3',
          400: '#e2626f', 500: '#cf3747', 600: '#a91d32', 700: '#8c1529',
          800: '#741526', 900: '#621625', 950: '#36070f',
        },
        gold: { 400: '#e9c46a', 500: '#d4a72c', 600: '#b38a1b' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
