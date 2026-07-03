// Visual QA harness: screenshots at the four checklist breakpoints + axe scans
// of home, the full-menu modal, and a category page.
// Usage: npm run preview &  then  node scripts/qa-shots.mjs [outDir]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:4173';
const OUT = process.argv[2] ?? 'test-results/shots';
mkdirSync(OUT, { recursive: true });
const widths = [360, 768, 1024, 1440];

// PW_CHROMIUM lets CI/containers point at a system Chromium instead of a
// playwright-managed download (e.g. /opt/pw-browsers/chromium).
const browser = await chromium.launch(
  process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
);
const results = [];

for (const w of widths) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 900 } })).newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/home-${w}-hero.png` });
  // Scroll through so .reveal content is visible in the full-page shot.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/home-${w}-full.png`, fullPage: true });
  await page.close();
}

const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const axeHome = await new AxeBuilder({ page }).analyze();
results.push(['axe home', axeHome.violations.map((v) => `${v.id}(${v.impact}) x${v.nodes.length}`)]);

await page.getByRole('button', { name: /view the full menu/i }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/menu-modal-1440.png` });
const axeMenu = await new AxeBuilder({ page }).analyze();
results.push(['axe menu', axeMenu.violations.map((v) => `${v.id}(${v.impact}) x${v.nodes.length}`)]);

await page.locator('[data-cat] button[aria-label^="View"]').first().click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/lightbox-1440.png` });
await page.keyboard.press('Escape');
await page.keyboard.press('Escape');

const mp = await (await browser.newContext({ viewport: { width: 360, height: 780 } })).newPage();
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.getByRole('button', { name: 'Menu', exact: true }).click();
await mp.waitForTimeout(500);
await mp.screenshot({ path: `${OUT}/mobile-menu-360.png` });
await mp.close();

await page.goto(BASE + '/products/breads', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/category-1440.png`, fullPage: true });
const axeCat = await new AxeBuilder({ page }).analyze();
results.push(['axe category', axeCat.violations.map((v) => `${v.id}(${v.impact}) x${v.nodes.length}`)]);

console.log(JSON.stringify(results, null, 2));
await browser.close();
