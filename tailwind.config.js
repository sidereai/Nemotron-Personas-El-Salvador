/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cielo: '#3B82F6',
        naranja: '#F97316',
        nube: '#FAFAFA',
        carbon: '#334155',
        rosa: '#EC4899',
        verde: '#10B981',
        rojo: '#EF4444',
        'cielo-light': '#93C5FD',
        'naranja-light': '#FDBA74',
        'verde-light': '#6EE7B7',
        'rojo-light': '#FCA5A5',
      },
      fontFamily: {
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        blob: '1.5rem',
        pill: '9999px',
      },
      keyframes: {
        'elastic-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '55%': { transform: 'scale(1.08)', opacity: '1' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(59, 130, 246, 0)' },
        },
        'heartbeat-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'elastic-in': 'elastic-in 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'heartbeat-line': 'heartbeat-line 4s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
