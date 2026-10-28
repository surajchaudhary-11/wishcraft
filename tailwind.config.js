/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FAF7F5',
          cream: '#FFFDF9',
          muted: '#F5EFEB',
          dark: '#1C1326',
        },
        plum: {
          50: '#F9F5F8',
          100: '#F3EBF2',
          200: '#E7D5E4',
          300: '#D5B4D0',
          400: '#BD8AB4',
          500: '#A16496',
          600: '#854C7B',
          700: '#6E3C64',
          800: '#5A3252',
          900: '#3D1B36',
          950: '#230E20',
        },
        rosewood: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        warmamber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(90, 50, 82, 0.06), 0 2px 6px -1px rgba(90, 50, 82, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(90, 50, 82, 0.1), 0 4px 12px -2px rgba(90, 50, 82, 0.06)',
        'soft-xl': '0 20px 45px -8px rgba(90, 50, 82, 0.14), 0 8px 16px -4px rgba(90, 50, 82, 0.08)',
        'glow': '0 0 25px rgba(225, 29, 72, 0.25)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}


