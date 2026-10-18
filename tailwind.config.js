/** @type {import('tailwindcss').Config} */
const tone = (name) => ({
  bg: `var(--${name}-bg)`,
  fg: `var(--${name}-fg)`,
  bd: `var(--${name}-bd)`,
})

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--border)',
        'line-strong': 'var(--border-strong)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        link: 'var(--link)',
        inv: 'var(--inv)',
        'on-inv': 'var(--on-inv)',
        pill: 'var(--pill)',
        dot: 'var(--dot)',
        clay: tone('clay'),
        blue: tone('blue'),
        olive: tone('olive'),
        sand: tone('sand'),
        rose: tone('rose'),
        ok: tone('ok'),
        bad: tone('bad'),
        warn: tone('warn'),
        verse: {
          bg: 'var(--verse-bg)',
          bar: 'var(--verse-bar)',
          bd: 'var(--verse-bd)',
          ink: 'var(--verse-ink)',
          muted: 'var(--verse-muted)',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Gill Sans', 'Segoe UI', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      letterSpacing: {
        eyebrow: '0.24em',
        label: '0.18em',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
      },
    },
  },
  plugins: [],
}
