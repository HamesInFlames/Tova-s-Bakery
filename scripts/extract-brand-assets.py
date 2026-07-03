#!/usr/bin/env python3
"""Extract brand assets from BRAND_MANUAL_TOVA_S.pdf (repo root).

Reproducible Phase-0 extraction for the official Tova's rebrand.
Requires: pip install pymupdf pillow

The manual is largely vector. Vector pages are exported as full-page SVG
(crop the individual marks in an editor or with the crop helpers below) AND
as high-zoom transparent-ish PNGs for immediate use. Raster photography
pages are exported at full resolution.

Page → asset map (1-indexed, verified against the 20-page manual):
  5-6   Primary identifier (wordmark)      → SVG + 6x PNG, white & black variants
  7     4 logo versions                    → SVG + 6x PNG
  10    Illustration style sheet           → SVG + 6x PNG (engraved breads)
  12    PARVE (black) & DAIRY (white) stickers → SVG + 6x PNG
  13-14 Packaging photography              → full-res raster (hero/quality imagery)
  15-17 Label system (white/gold/black/mint) + tray photos → SVG + raster
  18    Stencils (2 circular marks)        → SVG + 6x PNG (favicon candidates)
  19    Cup design photo                   → raster

Output: public/images/brand/manual/
  page-NN.svg           full-page vector export (vector pages)
  page-NN@6x.png        6x zoom render, for cropping / immediate use
  page-NN-img-MM.png    embedded raster images at native resolution

After running, convert chosen photography to WebP (sharp is in devDeps):
  node -e "require('sharp')('public/images/brand/manual/page-13-img-00.png').webp({quality:82}).toFile('public/images/brand/packaging-1.webp')"
"""

from __future__ import annotations

import pathlib
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF missing — run: pip install pymupdf")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDF = ROOT / "BRAND_MANUAL_TOVA_S.pdf"
OUT = ROOT / "public" / "images" / "brand" / "manual"

# 1-indexed page numbers.
VECTOR_PAGES = [5, 6, 7, 10, 12, 15, 16, 17, 18]
RASTER_PAGES = [13, 14, 15, 16, 17, 19]
ZOOM = 6  # ~432 dpi renders for clean cropping of vector art


def main() -> None:
    if not PDF.exists():
        sys.exit(
            f"{PDF.name} not found in repo root.\n"
            "Drop the brand manual there first (it lives on the "
            "chris.placencia@tovasbakery.com email of 2025-11-23)."
        )
    OUT.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)
    print(f"{PDF.name}: {doc.page_count} pages")

    for pno in sorted(set(VECTOR_PAGES + RASTER_PAGES)):
        page = doc[pno - 1]

        if pno in VECTOR_PAGES:
            svg = page.get_svg_image()
            (OUT / f"page-{pno:02d}.svg").write_text(svg, encoding="utf-8")
            pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), alpha=True)
            pix.save(OUT / f"page-{pno:02d}@{ZOOM}x.png")
            print(f"  p{pno}: SVG + {ZOOM}x PNG ({pix.width}x{pix.height})")

        # Embedded raster images at native resolution (photography).
        for i, info in enumerate(page.get_images(full=True)):
            xref = info[0]
            img = doc.extract_image(xref)
            ext = img["ext"]
            dest = OUT / f"page-{pno:02d}-img-{i:02d}.{ext}"
            dest.write_bytes(img["image"])
            print(f"  p{pno}: embedded image {i} → {dest.name} ({img['width']}x{img['height']})")

    doc.close()
    print(f"\nDone → {OUT.relative_to(ROOT)}")
    print("Next: crop the marks (wordmark white+black, 4 logo versions, stickers,")
    print("4 labels, 2 stencils, engraved breads) and convert photos to WebP.")


if __name__ == "__main__":
    main()
