/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0F2342',
          light: '#1B365D',
          dark: '#0A172C',
        },
        navyLight: '#1B365D',
        champagne: {
          DEFAULT: '#C59B27',
          light: '#F6EED8',
          hover: '#D4AA3B',
          dark: '#9A771C',
        },
        champagneLight: '#F6EED8',
        cream: '#FAF8F3',
        ivory: '#FFFFFF',
        slateText: '#475569',
      },
      boxShadow: {
        'envelope': '0 20px 40px -15px rgba(15, 35, 66, 0.35), 0 0 50px -10px rgba(197, 155, 39, 0.25)',
        'letter': '0 25px 50px -12px rgba(15, 35, 66, 0.15), 0 0 30px rgba(197, 155, 39, 0.1)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
