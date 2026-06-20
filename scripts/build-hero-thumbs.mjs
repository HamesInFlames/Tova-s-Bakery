// The hero backdrop is a blurred, 90%-darkened wall of product photos — it does
// not need full-res images. Generate tiny 260px thumbs for the 12 used, so the
// above-the-fold payload stays small. Run: node scripts/build-hero-thumbs.mjs
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const PUB = join(ROOT, 'public');

const content = JSON.parse(await readFile(join(ROOT, 'tovas-content.json'), 'utf8'));
const all = content.categories.flatMap((c) => c.sections.flatMap((s) => s.items)).map((it) => it.image).filter(Boolean);
const step = Math.max(1, Math.floor(all.length / 12));
const picks = Array.from({ length: 12 }, (_, i) => all[(i * step) % all.length]);

await mkdir(join(PUB, 'images/hero'), { recursive: true });
for (let i = 0; i < picks.length; i += 1) {
  const src = join(PUB, picks[i].replace(/^\//, ''));
  await sharp(src).resize({ width: 260, withoutEnlargement: true }).webp({ quality: 62 }).toFile(join(PUB, `images/hero/${i}.webp`));
}
console.log(`hero thumbs built: ${picks.length}`);
