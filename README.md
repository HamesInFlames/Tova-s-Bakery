# Tova's Bakery — Website Mockup

A custom rebuild mockup for **Tova's Bakery** (tovasbakery.com) — a kosher,
nut-free, COR-certified wholesale & retail bakery in Markham, Ontario, since 1999.

> **Status:** mockup / work-in-progress, rebranded to the **official brand manual**
> (`BRAND_MANUAL_TOVA_S.pdf` — monochrome black/white + gold/mint label accents,
> Qaligo wordmark, Cera Pro type). Product imagery is sourced from the live
> GoDaddy site as placeholders and should be replaced with final photography.
> The contact form uses a placeholder Web3Forms key. Body type is interim
> **Jost** until licensed Cera Pro files arrive (drop-in swap — see
> `src/styles/tokens.css`). Run `scripts/extract-brand-assets.py` once the
> brand-manual PDF is in the repo root to pull the clean vectors.

## What it is

A single-page, presentation-style site aimed at **wholesalers**, built to the
"Apple-like" brief: large visuals, generous whitespace, smooth section-jump
navigation. Sections: **Hero → Story → By the Numbers → The Range → Wholesale →
Quality → Contact**, plus deep-dive product pages at `/products/:slug`.

Highlights:

- **The Range** — an auto-scrolling carousel of random products + a **full-menu
  popup** (all 115 varieties by collection, jump-to-category bar, tap-to-enlarge
  lightbox with swipe + thumbnail filmstrip).
- **Quality** — the real COR/nut-free/parve/dairy/gluten-free/sugar-free labels
  and the loaf-with-label photography.
- **Wholesale** — the showcase + per-collection product videos.
- Cinematic hero, animated stat band, mobile-first responsive, full a11y.

## Stack

React 19 · TypeScript (strict) · Vite (rolldown-vite) · Tailwind CSS · Motion ·
react-router-dom. Content is data-driven from [`tovas-content.json`](tovas-content.json).
Forms via Web3Forms (no backend). Images optimized to WebP.

## Develop

```bash
npm install
npm run dev          # local dev server (prints the URL)
npm run dev -- --host  # expose on your network (open on a phone)
npm run build        # production build → dist/
npm run preview      # serve the production build
npm run typecheck    # tsc --noEmit
```

## Quality bar

Lighthouse (production): **Performance ~92 · Accessibility 100 · Best Practices
100 · SEO 92** · axe-core: **0 violations** · `npm audit`: **0 vulnerabilities**.

## Design system

Brand tokens (palette + type) live in [`src/styles/tokens.css`](src/styles/tokens.css);
the rationale is in [`design-system/MASTER.md`](design-system/MASTER.md).

## Before launch

- Drop `BRAND_MANUAL_TOVA_S.pdf` in the repo root and run
  `scripts/extract-brand-assets.py` — swap the interim traced wordmark SVGs for
  the PDF vectors; add the engraved illustrations, label artwork, and packaging
  photography at the `TODO(phase0)` markers.
- License **Cera Pro** (TypeMates) + optionally **Qaligo**; self-host the woff2
  files (the `@font-face` swap is documented in `src/styles/tokens.css`).
- Replace placeholder product imagery with final photography.
- Register a real Web3Forms access key (`VITE_WEB3FORMS_ACCESS_KEY`) for Tova's inbox.
- Move the wholesale videos to the client's own CDN.
- Add host-level 301s from the old `/…%7C…` category URLs to `/products/*`.
- Consider prerendering/SSG for an extra SEO/performance lift.
