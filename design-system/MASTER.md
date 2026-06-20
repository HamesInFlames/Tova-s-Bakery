# Tova's Bakery — Design System (MASTER)

> Locked deliberately up front via the ui-ux-pro-max ritual (search.py) on 2026-06-19,
> then refined for Tova's positioning. Source of truth for palette + type is
> `src/styles/tokens.css`; this doc is the human reference.

## Positioning
Warm, heritage, kosher-bakery. Premium but unpretentious. Coordinated with the sister
brand **Grodzinski** (both warm bakery earth tones) yet **visually distinct** from
Grodzinski's espresso / oat / gold + PMS-277 blue. **Never** KC's gold-on-black house brand.

## Pattern
**Hero-Centric + Conversion.** CTA above the fold; every page funnels to **Contact / Wholesale**.
No e-commerce, no prices, no product-detail pages.

## Style — "Nature Distilled"
Muted earthy warmth, generous whitespace, soft natural shadows, organic (slightly rounded)
radii, natural easing (200–300ms). Real product photography is the hero. Avoid the
generator's default "Vibrant & Block-based" — too playful for a COR-certified wholesale bakery.

## Color
| Role | Hex | Token |
|------|-----|-------|
| Background (wheat cream) | `#FBF4E6` | `--color-bg` |
| Elevated surface | `#FFFDF7` | `--color-bg-elevated` |
| Section band | `#F4E9D2` | `--color-bg-section` |
| Ink (cocoa) | `#2E1C12` | `--color-ink` |
| Ink soft | `#5A3D2B` | `--color-ink-soft` |
| Primary (amber-brown) | `#92400E` | `--color-primary` |
| Accent / CTA (terracotta) | `#C2410C` | `--color-accent` |
| Honey (decorative) | `#C98A2B` | `--color-honey` |
| Rule / border | `#E7D6B5` / `#D9C49B` | `--color-rule` / `--color-border` |

Contrast verified AA: ink 13:1, ink-soft 6.6:1, primary 7.5:1 on cream; white on accent/primary ≥4.5:1.

## Typography
- **Display / headings:** Playfair Display (500–700) — premium heritage serif, distinct from Grodzinski's Cormorant.
- **Body / UI:** Inter (400–600).
- Scale: Hero 56–72px, H2 ~30px, H3 ~20px, body 16–18px, label 12px uppercase tracking-wide.

## Effects
Soft shadows only (`--shadow-sm/md/lg`), 200ms hover transitions, scroll-reveal (`.reveal`,
honors `prefers-reduced-motion`), variant→hero image swap on the category configurator.

## Anti-patterns (avoid)
- Poor / low-res food photos; **never** ship the GoDaddy stock or AI-generated imagery.
- Hidden hours / contact. Bright neon, harsh animation, AI purple-pink gradients.
- Overusing the terracotta accent — it's a highlight, not a fill.

## Pre-delivery checklist (KC standard)
- [ ] No emojis as icons (Lucide SVG only)
- [ ] Hover states, 150–300ms transitions, cursor-pointer on clickables
- [ ] Text contrast ≥4.5:1; visible keyboard focus
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 360 / 768 / 1024 / 1440
- [ ] Real photography in place (no stock); WebP + responsive srcset; lazy-load
- [ ] Playwright + axe + Lighthouse pass; 0 npm vulnerabilities
