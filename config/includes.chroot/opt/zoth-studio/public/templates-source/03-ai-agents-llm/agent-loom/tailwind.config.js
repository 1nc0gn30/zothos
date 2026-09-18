/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        'pf-bg': {
          deep: '#0a0a0b',
          base: '#111113',
          raised: '#18181b',
          overlay: '#1f1f23',
        },
        'pf-border': {
          DEFAULT: '#2a2a30',
          subtle: '#222226',
        },
        'pf-text': {
          primary: '#e4e4e7',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        'pf-accent': {
          DEFAULT: '#ff6a00',
          dim: '#cc5500',
          bg: 'rgba(255, 106, 0, 0.12)',
          border: 'rgba(255, 106, 0, 0.35)',
        },
        status: {
          success: '#22c55e',
          error: '#ef4444',
          warn: '#f59e0b',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
