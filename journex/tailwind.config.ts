import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0a0a0a',
          50: '#0f0f0f',
          100: '#141414',
          200: '#1a1a1a',
          300: '#222222',
          400: '#2c2c2c',
          500: '#383838',
          600: '#484848',
          700: '#636363',
          800: '#7a7a7a',
          900: '#999999',
        },
        amber: {
          DEFAULT: '#D4A853',
          50: '#FBF5E8',
          100: '#F5E8CB',
          200: '#EDDAA8',
          300: '#E4CA82',
          400: '#DCB96A',
          500: '#D4A853',
          600: '#C4923A',
          700: '#A37830',
          800: '#7D5C25',
          900: '#57401A',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          50: '#FDFCFA',
          100: '#FAF8F4',
          200: '#F5F0E8',
          300: '#EDE5D6',
          400: '#E0D4BF',
          500: '#D0C3A8',
          600: '#BBA98A',
          700: '#9E8B6B',
          800: '#7D6E54',
          900: '#5C513E',
        },
        surface: {
          DEFAULT: '#0a0a0a',
          light: '#0f0f0f',
          lighter: '#141414',
          border: '#222222',
        },
        accent: {
          DEFAULT: '#D4A853',
          hover: '#E4CA82',
          muted: '#D4A85330',
        },
        muted: '#9999ad',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        serif: ['var(--font-dm-serif)', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        sans: ['var(--font-geist-mono)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4A853, #E4CA82, #D4A853)',
        'shimmer-gold': 'linear-gradient(90deg, transparent, #D4A85320, transparent)',
      },
      boxShadow: {
        'glow-sm': '0 0 12px -3px rgba(212, 168, 83, 0.15)',
        'glow-md': '0 0 24px -4px rgba(212, 168, 83, 0.2)',
        'glow-lg': '0 0 48px -8px rgba(212, 168, 83, 0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(212, 168, 83, 0.05)',
        'editorial': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 32px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 168, 83, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
