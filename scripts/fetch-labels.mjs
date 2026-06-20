// Grab the real Our-Labels assets: the 6 label badges (bigger) + the 3
// loaf-with-label lifestyle photos (the bottom row of the live page).
// Writes WebP into public/images/labels/ and updates tovas-content.json.
// Run: node scripts/fetch-labels.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const PUB = join(ROOT, 'public');
const BASE = 'https://img1.wsimg.com/isteam/ip/a0f05f19-563a-447a-b219-f1cd2df8c889/';

const get = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(`${r.status} ${u}`); return Buffer.from(await r.arrayBuffer()); };

const BADGES = [
  { file: '13.png', out: 'badge-nutfree-parve', alt: "Tova's Bakery label — Nut Free · Parve · Pas Yisroel" },
  { file: '14.png', out: 'badge-dairy-cholov', alt: "Tova's Bakery label — Nut Free · Dairy · Cholov Yisroel · Pas Yisroel" },
  { file: '18.png', out: 'badge-parve', alt: "Tova's Bakery label — Parve" },
  { file: '17.png', out: 'badge-glutenfree', alt: "Tova's Bakery label — Gluten Free" },
  { file: '19.png', out: 'badge-sugarfree', alt: "Tova's Bakery label — Sugar Free" },
  { file: '16.png', out: 'badge-dairy', alt: "Tova's Bakery label — Dairy" },
];
const LOAVES = [
  { file: 'blob-d1eab06.png', out: 'loaf-1', alt: "Tova's sourdough with the Nut-Free Dairy / Cholov Yisroel label applied" },
  { file: 'blob-f2b0b32.png', out: 'loaf-2', alt: "Tova's bread with the Nut-Free Parve label applied" },
  { file: 'blob-d5ea3e6.png', out: 'loaf-3', alt: "Tova's challah with the Nut-Free Parve label applied" },
];

await mkdir(join(PUB, 'images/labels'), { recursive: true });

const labelBadges = [];
for (const b of BADGES) {
  const buf = await get(BASE + b.file);
  const rel = `/images/labels/${b.out}.webp`;
  await sharp(buf).resize({ width: 760, withoutEnlargement: true }).webp({ quality: 92 }).toFile(join(PUB, rel.slice(1)));
  labelBadges.push({ image: rel, alt: b.alt });
}
console.log(`✓ ${labelBadges.length} badges`);

const labelLoaves = [];
for (const l of LOAVES) {
  const buf = await get(BASE + l.file);
  const rel = `/images/labels/${l.out}.webp`;
  await sharp(buf).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(PUB, rel.slice(1)));
  labelLoaves.push({ image: rel, alt: l.alt });
}
console.log(`✓ ${labelLoaves.length} loaf photos`);

const CONTENT = join(ROOT, 'tovas-content.json');
const content = JSON.parse(await readFile(CONTENT, 'utf8'));
content.labelBadges = labelBadges;
content.labelLoaves = labelLoaves;
await writeFile(CONTENT, JSON.stringify(content, null, 2) + '\n', 'utf8');
console.log('✓ content updated (labelBadges + labelLoaves)');
