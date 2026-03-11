/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '390px',
      'md': '768px',
      'lg': '1024px',
    },
    extend: {
      spacing: {
        'safe-t': 'env(safe-area-inset-top)',
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-l': 'env(safe-area-inset-left)',
        'safe-r': 'env(safe-area-inset-right)',
        'nav-h': '72px',
        'nav-pb': 'calc(72px + env(safe-area-inset-bottom))',
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '52px',
      },
      minWidth: {
        'touch': '44px',
      },
      colors: {
        bg: {
          primary: '#0D1B2A',
          card: '#1A2D42',
          hover: '#243B55',
        },
        brand: {
          green: '#10B981',
          'green-dark': '#065F46',
          'green-light': '#D1FAE5',
        },
        pill: {
          yellow: '#F59E0B',
          green: '#10B981',
          blue: '#3B82F6',
          red: '#EF4444',
          purple: '#8B5CF6',
          pink: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.3)',
        green: '0 4px 20px rgba(16,185,129,0.3)',
        modal: '0 -8px 40px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        'bounce-soft': 'bounceSoft 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'auto', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
