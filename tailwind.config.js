/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        space: {
          deep: '#05050f',
          bg: '#0a0a1a',
          card: '#111128',
          elevated: '#181835',
          border: '#2a2a5a',
          'border-bright': '#3a3a7a',
        },
        turquoise: {
          DEFAULT: '#00d4aa',
          dark: '#006655',
          light: '#00ffcc',
        },
        gold: {
          DEFAULT: '#f5c842',
          dark: '#b8900a',
        },
        terracotta: {
          DEFAULT: '#e85d2f',
          dark: '#a03a10',
        },
        jade: '#2ecc8b',
        cosmic: {
          purple: '#7c3aed',
          pink: '#ec4899',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-up': 'slide-in-up 0.5s ease-out forwards',
        'slide-right': 'slide-in-right 0.5s ease-out forwards',
        'slide-left': 'slide-in-left 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'nexus-enter': 'nexus-enter 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'orbit': 'orbit 8s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
        'xp-pop': 'xp-pop 1.2s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};