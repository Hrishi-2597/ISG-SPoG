/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0d1b2a',
          800: '#112240',
          700: '#1a3456',
          600: '#1e3f6e',
          500: '#2a5298',
          400: '#3a6bc0',
        },
        accent: '#4fc3f7',
      },
    },
  },
  plugins: [],
}
