// Enrich tovas-content.json category sections with the render-crawled product
// images + full variant lists (captured from the live GoDaddy carousels on
// 2026-06-19). Variant names are derived from the image filenames, with source
// typos corrected and SF/GF dietary tags extracted. Run: node scripts/enrich-content.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://img1.wsimg.com/isteam/ip/a0f05f19-563a-447a-b219-f1cd2df8c889/';

// Exact encoded filenames as served by the live carousels, grouped by category slug -> section heading.
const RAW = {
  'breads': {
    'Sourdough': ['Sourdough%20Plain%20(2).png', 'Sourdough%20Multigrain%20(2).png', 'Sourdough%20Olives.png'],
    'Challah': ['Challah%20Plain.png', 'Challah%20Seseme%20(2).png', 'Challah%20Raison%20(3).png'],
    'Bilkas': ['Bilka%20Plain.png', 'Bilka%20Seseme.png', 'Bilka%20Strusel.png', 'Bilkas%20(2).png'],
  },
  'danishes': {
    'Danish Cakes': ['Danish%20Cake%20Chocolate.png', 'Danish%20Cake%20Apple.png', 'Danish%20Cake%20Cherry.png', 'Danish%20Cake%20Poppyseeds.png', 'Danish%20Cake%20Cinnamon.png'],
    'Danish Rolls 6pc': ['Danish%20Rolls%20Apple%206pc.png', 'Danish%20Rolls%20Cherry%206pc.png', 'Danish%20Rolls%20Chocolate%206pc.png', 'Danish%20Rolls%20Caramel%206pc.png', 'Danish%20Rolls%20Poppyseeds%206pc.png', 'Danish%20Rolls%20Strawberry%206pc.png', 'Danish%20Rolls%20Blueberry%206pc.png', 'Danish%20Rolls%20Cinnamon%206pc.png', 'Cheese%20Danish%206pc.png'],
    'Danish Rolls 4pc': ['Danish%20Rolls%20Apple%204pc.png', 'Danish%20Rolls%20Cherry%204pc.png', 'Danish%20Rolls%20Chocolate%204pc.png', 'Danish%20Rolls%20Cinnamon%20Raison%204pc.png', 'Danish%20Rolls%20Poppyseeds%204pc.png', 'Danish%20Rolls%20Blueberry%204pc.png', 'Danish%20Rolls%20Strawberry%204pc.png', 'Cheese%20Danish%204pc.png'],
    'Frozen Danishes': ['6f8af179-bc14-4c0a-b71f-69b7510c0454.jpg', 'aa247f35-1170-454c-b918-fd5be97ca59d.jpg', 'd7214126-7511-41b8-a8a8-f8f205d6389c.jpg', '65924b47-cd18-4e89-9f40-70552a36bbf0.jpg', '3d3b6b09-5951-4625-be2d-a75e856422a0.jpg', '7eb23eeb-a4dc-43e2-9aab-7d14e36e6d6a.jpg', '968bb48b-b573-4355-a9e7-c9dc2250ac5c.jpg', '6d821ca7-3a81-440c-a3e0-f4ecebd82a6e.jpg'],
  },
  'muffins-loaf-pie': {
    'Muffins': ['Muffin%20Carrot.png', 'Muffin%20Vanilla.png', 'Muffin%20Red%20Valvet.png', 'Muffin%20Chocolate%20Chip.png'],
    'Loaf Cakes': ['Loaf%20Cake%20Honey.png', 'Loaf%20Cake%20Lemon.png', 'Loaf%20Cake%20Marbel.png', 'Loaf%20Cake%20Chocolate.png', 'Loaf%20Cake%20Chocolate%20Chip.png', 'Loaf%20Cake%20Apple%20Cinnamon.png'],
    'Pies': ['Pie%20Apple%20Rasberry.png', 'Pie%20Blueberry.png'],
  },
  'cookies-snack-pastries': {
    'Cookies': ['Cookies.png', 'Cookies%20Sprinkles.png', 'Moon%20Cookies%20Poppyseeds.png', 'Cookies%20Lady%20Finger.png', 'Cookies%20Two%20Tones.png', 'Cookies%20Jam%20Drops.png', 'Cookies%20Sprincles%20Delight.png', 'Cookies%20Strawberry.png', 'Cookies%20Poppyseeds.png', 'Cookies%20Apricot.png', 'Cookies%20Margaritas.png', 'Cookie%20Birthday%20Cake.png', 'Cookies%20Caramel.png', 'Cookies%20Chocolate%20Chip.png'],
    'Bites': ['Bites%20Lemon.png', 'Bites%20Chocolate.png', 'Bites%20Rasberry.png', 'Bites%20Cinnamon.png', 'Bites%20Apricot.png', 'Bites%20Strawberry.png', 'Bites%20Date.png', 'Bites%20Rasberry%20SF.png', 'Bites%20Cherry%20SF.png'],
    'Biscotti': ['Biscotti%20Banana%20Caramel.png', 'Biscotti%20Orange%20Cranberries.png', 'Biscotti%20Poppyseeds.png', 'Biscotti%20Chocolate%20Chips.png'],
    'Mandel Bread': ['Mandel%20Bread%20Orange%20Cranberry.png', 'Mandel%20Bread%20Poppyseeds.png', 'Mandel%20Marbel.png', 'Mandel%20Chocolate%20Chips.png'],
    'Alfajores': ['Alfajores.png'],
    'Mini Donuts': ['Mini%20Donut%20Chocolate.png'],
    'Short Bread': ['Short%20Bread%20Cinnamon.png'],
  },
  'classic-pastries': {
    'Croissants': ['Croissant%20Plain.png', 'Croissant%20Apple%20Cinnamon.png', 'Croissant%20Cookiedough.png'],
    'Hungarian Roulade': ['Hungarian%20Roulade%20Cinnamon.png', 'Hungarian%20Roulade%20Caramel.png'],
    'Strudel': ['Strudel%20Apple%20Cinnamon.png'],
  },
  'babka-rogalach': {
    'Babkas': ['Babka%20Chocolate.png', 'Small%20Babka%20Chocolate.png'],
    'Rugelach': ['Rogalach%20Rasberry.png'],
  },
  'cakes-desserts': {
    'Cakes': ['Cake.png', 'Cake%20Cookies%20%26%20Cream.png', 'Cake%20Queen%20Victoria.png', 'Cake%20Strawberry%20Shortcake.png', 'Cake%20Caramel%20Coffee.png', 'Cake%20Double%20Chocolate.png', 'Cake%20Chocolate%20Cream.png', 'Cake%20Cookiedough.png', 'Cake%20Boston%20Cream.png', 'Cake%20Tiramisu.png', 'Cake%20Vanilla%20Cream.png', 'Cake%20Red%20Valvet.png'],
    'Personal Desserts': ['Personal%20Dessert%20Coconut%20Lime.png', 'Personal%20Dessert%20Red%20Valvet.png', 'Personal%20Dessert%20Tiramisu.png', 'Personal%20Dessert%20Lemon%20Meringue.png', 'Personal%20Dessert%20Strawberry%20Shortcake%20(2).png', 'Personal%20Dessert%20Cookiedough.png', 'Personal%20Dessert%20Cookies%20%26%20Cream%20(2).png', 'Personal%20Dessert%20Carrot.png'],
  },
};

// Section heading -> prefix tokens to strip from each variant name.
const PREFIXES = {
  'Sourdough': ['Sourdough'], 'Challah': ['Challah'], 'Bilkas': ['Bilka', 'Bilkas'],
  'Danish Cakes': ['Danish Cake'], 'Danish Rolls 6pc': ['Danish Rolls'], 'Danish Rolls 4pc': ['Danish Rolls'],
  'Muffins': ['Muffin'], 'Loaf Cakes': ['Loaf Cake'], 'Pies': ['Pie'],
  'Cookies': ['Cookies', 'Cookie'], 'Bites': ['Bites'], 'Biscotti': ['Biscotti'], 'Mandel Bread': ['Mandel Bread', 'Mandel'],
  'Mini Donuts': ['Mini Donut'], 'Short Bread': ['Short Bread'],
  'Croissants': ['Croissant'], 'Hungarian Roulade': ['Hungarian Roulade'], 'Strudel': ['Strudel'],
  'Babkas': ['Babka'], 'Rugelach': ['Rogalach', 'Rugelach'],
  'Cakes': ['Cake'], 'Personal Desserts': ['Personal Dessert'],
};

const TYPOS = { Seseme: 'Sesame', Raison: 'Raisin', Strusel: 'Streusel', Valvet: 'Velvet', Rasberry: 'Raspberry', Marbel: 'Marble', Sprincles: 'Sprinkles', Poppyseeds: 'Poppy Seed', Poppyseed: 'Poppy Seed', Cookiedough: 'Cookie Dough' };

const isUuid = (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

function cleanVariant(heading, file, idx) {
  const raw = decodeURIComponent(file).replace(/\.(png|jpe?g|webp)$/i, '').replace(/\s*\(\d+\)\s*$/, '').trim();
  if (isUuid(raw)) return { name: `Assorted ${idx + 1}`, tags: [], raw };

  let name = raw;
  const tags = [];
  if (/\bSF\b/.test(name)) { tags.push('sugar-free'); name = name.replace(/\bSF\b/g, '').trim(); }
  if (/gluten\s*free|\bGF\b/i.test(name)) { tags.push('gluten-free'); name = name.replace(/gluten\s*free|\bGF\b/ig, '').trim(); }
  name = name.replace(/\b\d+\s*pc\b/ig, '').trim(); // pack size lives in the heading

  for (const p of (PREFIXES[heading] || [])) {
    const re = new RegExp('^' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b\\s*', 'i');
    if (re.test(name)) { name = name.replace(re, '').trim(); break; }
  }
  name = name.split(/\s+/).map((w) => TYPOS[w] || w).join(' ').replace(/\s+/g, ' ').trim();
  if (!name) name = titleCase(heading.replace(/s$/, '')); // bare "Cookies.png" -> "Cookie"
  return { name: titleCase(name), tags, raw };
}

function buildSections(slug) {
  const groups = RAW[slug];
  return Object.entries(groups).map(([heading, files]) => {
    const items = [];
    const seen = new Set();
    files.forEach((file, idx) => {
      const { name, tags, raw } = cleanVariant(heading, file, idx);
      const key = name.toLowerCase() + '|' + tags.join(',');
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ name, tags, image: BASE + file, sourceName: raw });
    });
    const section = { heading, assortedImage: items[0]?.image ?? null, items };
    if (files.length && isUuid(decodeURIComponent(files[0]).replace(/\.\w+$/, ''))) {
      section.note = 'Live filenames are UUIDs (no variant names) — labels are placeholders; confirm the real lineup with Chris.';
    }
    return section;
  });
}

const path = new URL('../tovas-content.json', import.meta.url);
const content = JSON.parse(readFileSync(path, 'utf8'));

let totalVariants = 0;
for (const cat of content.categories) {
  if (!RAW[cat.slug]) { console.warn('No render data for', cat.slug); continue; }
  cat.sections = buildSections(cat.slug);
  cat.variantsComplete = true;
  cat.imageSource = 'render-crawl 2026-06-19 (live GoDaddy carousels) — placeholder photos, replace with Chris\'s photography';
  totalVariants += cat.sections.reduce((n, s) => n + s.items.length, 0);
}

// Refresh the meta note now that variants are complete.
content.$meta.warnings = content.$meta.warnings.filter((w) => !w.startsWith('Variant lists are INCOMPLETE'));
content.$meta.warnings.push('Variant lists + product images completed via render-crawl on 2026-06-19. Product images are live GoDaddy URLs used as PLACEHOLDERS; download + convert to WebP and replace with Chris\'s real photography before launch.');

writeFileSync(path, JSON.stringify(content, null, 2) + '\n', 'utf8');

const summary = content.categories.map((c) => `  ${c.slug}: ${c.sections.length} sections, ${c.sections.reduce((n, s) => n + s.items.length, 0)} variants`).join('\n');
console.log(`Enriched ${content.categories.length} categories, ${totalVariants} total variants:\n${summary}`);
