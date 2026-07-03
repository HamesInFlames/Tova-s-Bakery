// INTERIM wordmark vectors, traced from the 480px raster logo already in the
// repo (public/images/brand/logo.png — it IS the official mark: Qaligo TOVA'S,
// SINCE 1999 arc, rolling-pin BAKERY plate, white on black).
//
// TODO(phase 0): replace these traced SVGs with the clean vectors extracted
// from BRAND_MANUAL_TOVA_S.pdf pages 5-7 (scripts/extract-brand-assets.py).
//
// Usage: npm i -D potrace@2.1.1 && node scripts/make-interim-wordmark.mjs
//        (potrace is installed on demand — its jimp chain carries audit noise,
//        so it isn't kept in devDependencies; 2.1.1 is the audit-clean pin.)
// Output: public/images/brand/
//   logo-stacked-white.svg / logo-stacked-black.svg  (full lockup, version a)
//   wordmark-white.svg / wordmark-black.svg          (TOVA'S only, version b)

import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';

const SRC = 'public/images/brand/logo.png';
const OUT = 'public/images/brand';
const SCALE = 4; // 480 → 1920 before tracing for smoother curves

function trace(buf, opts = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(
      buf,
      { threshold: 128, turdSize: 24, optTolerance: 0.35, alphaMax: 1, ...opts },
      (err, svg) => (err ? reject(err) : resolve(svg)),
    );
  });
}

// The source is white-on-dark. Potrace fills the DARK areas, so invert first:
// mark becomes black-on-white and potrace traces the mark itself.
async function markBitmap(region) {
  let img = sharp(SRC);
  if (region) img = img.extract(region);
  return img
    .resize({ width: (region?.width ?? 480) * SCALE, kernel: 'lanczos3' })
    .grayscale()
    .negate()          // mark: white→black, bg: dark→light
    .threshold(150)    // clean 1-bit edges
    .png()
    .toBuffer();
}

function recolor(svg, fill) {
  return svg
    .replace(/fill="[^"]*"/g, `fill="${fill}"`)
    .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" ');
}

async function make(name, region) {
  const svg = await trace(await markBitmap(region));
  await writeFile(`${OUT}/${name}-black.svg`, recolor(svg, '#000000'));
  await writeFile(`${OUT}/${name}-white.svg`, recolor(svg, '#FFFFFF'));
  console.log(`${name}: black + white SVG written`);
}

// Full stacked lockup — trim the raster's outer padding.
await make('logo-stacked', { left: 55, top: 110, width: 370, height: 240 });
// Wordmark-only band (the big TOVA'S letters).
await make('wordmark', { left: 58, top: 203, width: 364, height: 86 });
console.log('Interim vectors done — swap for PDF extractions in Phase 0.');
