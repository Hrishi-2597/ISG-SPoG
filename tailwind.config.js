/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        base:  '#070f1a',
        surf:  '#0c1929',
        raise: '#111f33',
        inset: '#0a1522',
        navy: {
          900: '#070f1a',
          800: '#0c1929',
          700: '#111f33',
          600: '#1a3050',
          500: '#1e3f6e',
          400: '#2a5298',
        },
        accent: {
          DEFAULT: '#38bdf8',
          dim:     'rgba(56,189,248,0.12)',
          glow:    'rgba(56,189,248,0.30)',
        },
        good:  '#34d399',
        warn:  '#fbbf24',
        bad:   '#f87171',
      },
      boxShadow: {
        'card-idle':   '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.6), 0 0 0 1px rgba(56,189,248,0.25)',
        'card-active': '0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.5), 0 0 20px rgba(56,189,248,0.12)',
        'panel':       '0 2px 8px rgba(0,0,0,0.4)',
        'glow-sm':     '0 0 12px rgba(56,189,248,0.35)',
      },
      backgroundImage: {
        'accent-line': 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
        'layer-head':  'linear-gradient(90deg, rgba(56,189,248,0.08) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0, transform: 'translateY(-4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'pulse-soft': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
      },
      animation: {
        'fade-in':    'fade-in 0.18s ease-out',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
