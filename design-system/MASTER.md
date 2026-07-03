# Tova's Bakery — Design System (MASTER)

> Rebranded 2026-07 to the **official brand manual** (`BRAND_MANUAL_TOVA_S.pdf`,
> 20 pp, from the brand designer via Chris). Source of truth for palette + type is
> `src/styles/tokens.css`; this doc is the human reference.
>
> ⚠️ This is **Tova's official brand**, not KC's gold-on-black house brand —
> different gold, pure black/white foundation. **Do not cross-contaminate.**

## Positioning
Family tradition since 1999, finally given a name. Kosher, nut-free, COR-certified,
wholesale-first. The identity is quiet, confident, editorial — packaging photography
on black, monochrome type, a label system that does the color talking.

## Pattern
**Hero-Centric + Conversion** (unchanged). CTA above the fold; every page funnels to
**Contact / Wholesale**. No e-commerce, no prices, no product-detail pages.

## Style — Monochrome-first
Black-on-white and white-on-black carry everything. Thin hairline rules frame and
separate (the manual's `VISUAL IDENTITY ——— TOVA'S` header / `——— TOVASBAKERY.COM ———`
footer language). Sharp, minimal geometry: 0–2 px radii on cards/buttons/inputs;
only sticker-style badges are fully round. **No box shadows** — rules do the work.
Crisp motion, 150–250 ms.

## Color (complete — no other brand colors exist)
| Role | Hex | Token |
|------|-----|-------|
| White — primary background | `#FFFFFF` | `--c-bg` / Tailwind `paper` |
| Black — ink, dark sections, primary buttons | `#000000` | `--c-ink` / `ink` |
| Gold — accent; label system: **gluten free** | `#BB9462` | `--c-gold` / `gold` |
| Mint — label system: **sugar free** | `#A2D2BB` | `--c-mint` / `mint` |

Rules/borders: pure black at low alpha (`border-ink/15`; `border-paper/25` on black).

**Contrast guardrails (hard):**
- Gold on white ≈ **2.6:1** → decorative, borders, large display only. **Never body
  or small UI text on white.** Mint likewise (≈ 1.6:1 — decorative only on white).
- Gold on black ≈ **7:1** → fine for small text (eyebrows on black sections).
- Black text on gold ≈ 7:1 ✓, on mint ≈ 13:1 ✓ (label chips).
- All reading text is black-on-white or white-on-black.

## The label system (dietary tags)
Direct port of the manual's sticker/label artwork:
| Tag | Treatment |
|-----|-----------|
| Parve | black sticker — `bg-ink text-paper` |
| Dairy | white sticker — `bg-paper text-ink border-ink/30` |
| Gluten free | gold label — `bg-gold text-ink` |
| Sugar free | mint label — `bg-mint text-ink` |
Chips are `rounded-full`, bold tracked caps.

## Typography
- **Wordmark:** Qaligo (uppercase display serif) — **never live text**, always the
  SVG asset (`public/images/brand/wordmark-*.svg`, `logo-stacked-*.svg`).
- **Everything else:** Cera Pro in exactly five styles — Light 300, Italic 400,
  Medium 500, Bold 700, Black 900.
- **Font status:** licensed Cera Pro files are **pending from the brand designer**.
  Interim stand-in: **Jost** (self-hosted, `@fontsource/jost`, same five styles).
  `--font-sans` lists `'Cera Pro'` first, so dropping licensed `.woff2` files +
  `@font-face` blocks into `public/fonts/` is a zero-component-change swap (see the
  TODO in `tokens.css`). Do **not** extract fonts from the PDF — they're glyph
  subsets and unlicensed.
- House style: **wide-tracked uppercase labels** (nav, eyebrows, badges, footer) —
  `tracking-caps` (0.18em) / `tracking-caps-wide` (0.3em), `font-medium`,
  `ink/60` on white (gold or `paper/60` on black). Headings: Bold/Black.
  The brand quote may be Italic/Light. One deliberate exception: the
  certification lockup "NUT FREE – PARVE – PAS YISROEL" is **bold, full-strength**
  tracked caps — it's a lockup, not an eyebrow.

## Section rhythm (home)
Black hero (packaging photography on black, white stacked logo, white outline CTA)
→ white Story (official brand copy) → black By-the-Numbers (gold hairline separators)
→ white Range (monochrome chrome; product photos keep their color) → black Wholesale
(videos) → white Quality (label system + brand belief copy) → white Contact.

## Buttons
- On white: `bg-ink text-paper`, hover `bg-gold text-ink`.
- On black: white outline — `border-paper text-paper`, hover `bg-paper text-ink`.
- Tracked-caps labels, `rounded-none`; circular icon buttons stay `rounded-full`.
- Gold appears on **hover/focus only** (global focus ring is gold — visible on both
  white and black).

## Illustration
Black-and-white engraved/hatched bread illustrations (challah, rolls, babka) from
manual p. 10 — decorative corner/edge motifs and dividers only, never dominant,
never colored. *(Pending Phase-0 extraction — `TODO(phase0)` markers sit where they
belong in the JSX.)*

## Brand assets
`public/images/brand/`: `wordmark-black/white.svg`, `logo-stacked-black/white.svg`
(interim traces from the 480 px raster — replace with PDF vectors via
`scripts/extract-brand-assets.py` once `BRAND_MANUAL_TOVA_S.pdf` is in the repo
root). Manual extractions land in `public/images/brand/manual/`.

## Anti-patterns (avoid)
- Any color outside white/black/gold/mint (+ black/white alpha). No ambers,
  terracottas, creams — the old "Nature Distilled" palette is dead.
- Gold or mint as fills for sections/UI chrome, or as small text on white.
- Box shadows, organic 16–20 px radii, AI-gradient slop, purple-pink gradients.
- Live-text logo. Emojis as icons (Lucide only). Stock imagery.
- Cross-contaminating KC's or Grodzinski's house styles.

## Pre-delivery checklist (KC standard)
- [ ] No emojis as icons (Lucide SVG only)
- [ ] Hover states, 150–250 ms transitions, cursor-pointer on clickables
- [ ] Reading-text contrast ≥ 4.5:1 (monochrome pairs only); visible gold keyboard focus
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 360 / 768 / 1024 / 1440
- [ ] Real photography (no stock); WebP + responsive srcset; lazy-load
- [ ] Playwright + axe + Lighthouse pass; 0 npm vulnerabilities
- [ ] Wordmark is the SVG asset everywhere (no live-text logo)
