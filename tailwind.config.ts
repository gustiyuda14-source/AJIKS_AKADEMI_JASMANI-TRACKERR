import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fire: {
          DEFAULT: '#FF4500',
          dark: '#CC3700',
          light: '#FF6A3D',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#CCB000',
          light: '#FFE566',
        },
        'dark-bg': '#0D0D0D',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'dark-text': '#E5E5E5',
        'dark-muted': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        fire: '0 0 20px rgba(255, 69, 0, 0.3)',
        gold: '0 0 20px rgba(255, 215, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
