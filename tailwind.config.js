/** @type {import('tailwindcss').Config} */
// Palette is driven by RGB channel triplets in src/styles/tokens.css using the
// `<alpha-value>` pattern so opacity modifiers work (bg-ink/40, text-cream/75…).
const ch = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: ch('--c-bg'),
        'cream-soft': ch('--c-bg-elevated'),
        wheat: ch('--c-bg-section'),
        ink: ch('--c-ink'),
        'ink-soft': ch('--c-ink-soft'),
        primary: {
          DEFAULT: ch('--c-primary'),
          hover: ch('--c-primary-hover'),
        },
        accent: {
          DEFAULT: ch('--c-accent'),
          hover: ch('--c-accent-hover'),
        },
        honey: ch('--c-honey'),
        rule: ch('--c-rule'),
        'border-warm': ch('--c-border'),
      },
      fontFamily: {
        serif: ['Playfair Display', 'Playfair Fallback', 'Georgia', 'serif'],
        sans: ['Inter', 'Inter Fallback', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(46,28,18,0.06)',
        warm: '0 10px 30px -12px rgba(46,28,18,0.18)',
      },
    },
  },
  plugins: [],
};
