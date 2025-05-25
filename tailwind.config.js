/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        'brown': {
          50: '#faf5f1',
          100: '#f0e6dd',
          200: '#e1ccb9',
          300: '#d0ad8e',
          400: '#bb8a65',
          500: '#a87047',
          600: '#95583b',
          700: '#7c4733',
          800: '#653a2e',
          900: '#543329',
          950: '#2d1a15',
        },
      },
      boxShadow: {
        'plant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};