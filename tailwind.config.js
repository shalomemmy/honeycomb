/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honeycomb: {
          50: '#fef7e6',
          100: '#fdecc3',
          200: '#fbd68a',
          300: '#f8bb4d',
          400: '#f59e20',
          500: '#f2850a',
          600: '#e36a05',
          700: '#bc5208',
          800: '#95410e',
          900: '#78360f',
        },
        elemental: {
          fire: '#ff4444',
          water: '#4444ff',
          earth: '#44ff44',
          air: '#ffff44',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
} 