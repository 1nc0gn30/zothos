/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6466FA',
          50: '#F5F5FF',
          100: '#EBEBFF',
          200: '#D6D7FE',
          300: '#B4B6FD',
          400: '#8A8DFB',
          500: '#6466FA',
          600: '#4D4FF6',
          700: '#383AE8',
          800: '#2A2CC4',
          900: '#1E1B4B',
        },
        dark: {
          950: '#090a0f',
          900: '#0f111a',
          850: '#151824',
          800: '#1c2030',
          750: '#24293e',
          700: '#2d334d',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
