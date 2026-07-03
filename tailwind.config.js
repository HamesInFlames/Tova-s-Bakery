/** @type {import('tailwindcss').Config} */
// Palette is driven by RGB channel triplets in src/styles/tokens.css using the
// `<alpha-value>` pattern so opacity modifiers work (border-ink/15, bg-paper/95…).
// Official brand: white/black monochrome + gold (gluten free) + mint (sugar
// free) label accents. No other brand colours exist.
const ch = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: ch('--c-bg'),
        ink: ch('--c-ink'),
        gold: ch('--c-gold'),
        mint: ch('--c-mint'),
      },
      fontFamily: {
        sans: ['Cera Pro', 'Jost', 'Jost Fallback', 'system-ui', 'sans-serif'],
        display: ['Cera Pro', 'Jost', 'Jost Fallback', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      // Sharp, minimal geometry — every named radius flattens to 2px so a
      // stray rounded-xl can never reintroduce organic corners. Circular
      // sticker-style badges use `rounded-full` (untouched, 9999px).
      borderRadius: {
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
      },
      letterSpacing: {
        caps: '0.18em',
        'caps-wide': '0.3em',
      },
    },
  },
  plugins: [],
};
