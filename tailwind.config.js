/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fire: '#FF4500',
        'fire-dark': '#B33000',
        'fire-light': '#FF6500',
        gold: '#FFB300',
        'gold-dim': '#D49500',
        'bg-dark': '#0A0503',
        'surface': '#120805',
        'surface-2': '#1A0C08',
        'surface-3': '#24110A',
        'text-primary': '#FDFDFD',
        'text-secondary': '#CCCCCC',
        'text-tertiary': '#888888',
      },
      fontFamily: {
        heading: ["'Barlow Condensed'", 'sans-serif'],
        body: ["'Barlow'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
