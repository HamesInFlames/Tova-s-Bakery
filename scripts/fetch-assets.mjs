// Download the real assets from the live GoDaddy site and localize them:
//  - logo + 6 kosher/label badges  -> public/images/{brand,labels}/  (WebP)
//  - 115 product photos             -> public/images/products/<cat>/   (WebP, max 800px)
//  - 6 wholesale video posters      -> public/images/video-posters/    (WebP)
//  - wire the 6 wholesale .mp4 videos (hotlinked from wsimg — ~100MB total,
//    kept on the CDN so the repo stays lean) into pages.wholesale.
// Rewrites tovas-content.json image paths to the local WebP files.
// Run: node scripts/fetch-assets.mjs
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const PUB = join(ROOT, 'public');
const CONTENT = join(ROOT, 'tovas-content.json');

const IP = 'https://img1.wsimg.com/isteam/ip/a0f05f19-563a-447a-b219-f1cd2df8c889/';
const VID = 'https://img1.wsimg.com/blobby/go/a0f05f19-563a-447a-b219-f1cd2df8c889/video/';
const THUMB = IP + 'thumbnails/';

const get = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
};
const ensure = (dir) => mkdir(dir, { recursive: true });
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
async function toWebp(buf, rel, width, quality = 82) {
  const out = join(PUB, rel.slice(1));
  await ensure(dirname(out));
  await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(out);
  return rel;
}

const VIDEOS = {
  'Breads & Challah': { file: 'Tovas_01_Breads_and_Challah.mp4', poster: 'thumbnail-fdfec31e-23dc-410f-9287-e705e618c653.png' },
  'Babka & Bagged Loaves': { file: 'Tovas_02_Babka_and_Bagged.mp4', poster: 'thumbnail-1df4a194-9256-412c-ab55-6e200936ddac.png' },
  'Cookies & Biscotti': { file: 'Tovas_03_Cookies_and_Biscotti.mp4', poster: 'thumbnail-ec32a41b-8b92-4ff0-86ee-bae8969eadb0.png' },
  'Sweet Pastries & Treats': { file: 'Tovas_04_Sweet_Pastries.mp4', poster: 'thumbnail-e710d6a2-58cb-4451-9409-64bd005f3906.png' },
  'Cakes & Desserts': { file: 'Tovas_05_Cakes_and_Desserts.mp4', poster: 'thumbnail-f2b2c11a-dc9f-4a65-83da-f78ca066e219.png' },
};
const SHOWCASE = { file: 'Tovas_Wholesale_Showcase.mp4', poster: 'thumbnail-5926ba9c-6ad2-4f41-8c30-40d6a25151f4.png' };

const content = JSON.parse(await readFile(CONTENT, 'utf8'));
let n = 0;
const fails = [];

// 1. Logo (jpeg → webp + png)
try {
  const buf = await get(IP + '5630ebaf-4430-42b1-892d-5c466287c0fd.jpeg');
  await toWebp(buf, '/images/brand/logo.webp', 480, 92);
  await ensure(join(PUB, 'images/brand'));
  await sharp(buf).resize({ width: 480, withoutEnlargement: true }).png().toFile(join(PUB, 'images/brand/logo.png'));
  content.site.logo.local = '/images/brand/logo.webp';
  n += 1;
  console.log('✓ logo');
} catch (e) { fails.push('logo: ' + e.message); }

// 2. Label badges (real cert graphics from /our-labels)
const badgeNums = ['13', '14', '16', '17', '18', '19'];
const badges = [];
for (const num of badgeNums) {
  try {
    const buf = await get(IP + num + '.png');
    badges.push(await toWebp(buf, `/images/labels/badge-${num}.webp`, 260, 92));
    n += 1;
  } catch (e) { fails.push(`badge ${num}: ` + e.message); }
}
content.labelBadges = badges;
console.log(`✓ ${badges.length} badges`);

// 3. Product images → WebP, rewrite content paths
let prod = 0;
for (const cat of content.categories) {
  for (const sec of cat.sections) {
    for (let i = 0; i < sec.items.length; i += 1) {
      const it = sec.items[i];
      if (!it.image || !it.image.startsWith('http')) continue;
      try {
        const buf = await get(it.image);
        const fname = `${slug(sec.heading)}-${slug(it.name) || i}.webp`;
        it.image = await toWebp(buf, `/images/products/${cat.slug}/${fname}`, 800);
        prod += 1; n += 1;
      } catch (e) { fails.push(`${cat.slug}/${it.name}: ` + e.message); }
    }
    sec.assortedImage = sec.items[0]?.image ?? null;
  }
  console.log(`✓ ${cat.slug}`);
}
console.log(`✓ ${prod} product images`);

// 4. Wholesale videos + posters
for (const sec of content.pages.wholesale.sections) {
  const v = VIDEOS[sec.heading];
  if (!v) continue;
  try {
    const pbuf = await get(THUMB + v.poster);
    sec.poster = await toWebp(pbuf, `/images/video-posters/${slug(sec.heading)}.webp`, 900, 80);
    n += 1;
  } catch (e) { fails.push(`poster ${sec.heading}: ` + e.message); }
  sec.video = VID + v.file;
}
try {
  const pbuf = await get(THUMB + SHOWCASE.poster);
  const poster = await toWebp(pbuf, '/images/video-posters/showcase.webp', 1280, 82);
  content.pages.wholesale.showcaseVideo = { src: VID + SHOWCASE.file, poster };
  n += 1;
} catch (e) { fails.push('showcase poster: ' + e.message); }
console.log('✓ wholesale videos wired');

await writeFile(CONTENT, JSON.stringify(content, null, 2) + '\n', 'utf8');
console.log(`\nDONE — ${n} assets localized.`);
if (fails.length) console.log(`\n${fails.length} FAILURES:\n` + fails.join('\n'));
