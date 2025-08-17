/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ultra-modern glassmorphism palette
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
          hover: 'rgba(255, 255, 255, 0.15)',
        },
        // Modern gradient colors
        gradient: {
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          danger: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          blue: 'linear-gradient(135deg, #667eea 0%, #4facfe 100%)',
          emerald: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        },
        // Premium color system
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5ff',
          300: '#a5b8ff',
          400: '#8190ff',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b46c1',
          900: '#764ba2',
        },
        // Success gradient colors
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Danger gradient colors
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif'
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-modern': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-danger': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(100, 150, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(100, 150, 255, 0.4)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 15px 35px rgba(31, 38, 135, 0.2)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'float': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'float-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 15s ease infinite',
        'bounce-soft': 'bounce-soft 1s infinite',
        'fade-up': 'fade-up 0.5s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(100, 150, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(100, 150, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}