import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import { categories } from '@/data/content';
import Reveal from './Reveal';
import ProductMarquee from './ProductMarquee';
import ProductLightbox, { type LightboxItem } from './ProductLightbox';
import FullMenuModal from './FullMenuModal';

const TOTAL = categories.reduce((n, c) => n + c.sections.reduce((m, s) => m + s.items.length, 0), 0);

const ALL: LightboxItem[] = categories.flatMap((c) =>
  c.sections.flatMap((s) => s.items.map((it) => ({ name: it.name, image: it.image, tags: it.tags, collection: s.heading }))),
);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// A random spread so the carousel shows variety across every collection.
const RANDOM = shuffle(ALL).slice(0, 30);

export default function RangeShowcase() {
  const [lb, setLb] = useState<{ items: LightboxItem[]; index: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // One body-scroll lock for both overlays (lightbox stacks above the menu).
  useEffect(() => {
    const open = menuOpen || !!lb;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, lb]);

  return (
    <section id="range" className="overflow-hidden border-t border-ink/15 bg-paper py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-caps-wide text-ink/60">The Range</p>
          <h2 className="font-display text-4xl font-bold text-ink sm:text-5xl">Seven collections, {TOTAL} varieties</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/65">
            A taste of the range, scrolling on its own &mdash; hover to pause, tap any item to see it up close. Open the
            full menu to browse everything by collection.
          </p>
        </Reveal>
      </div>

      {/* TODO(phase0): engraved-bread divider between subsections */}
      {/* One carousel of random products */}
      <Reveal className="rail-row mt-14">
        <ProductMarquee items={RANDOM} onOpen={(i) => setLb({ items: RANDOM, index: i })} />
      </Reveal>

      <Reveal className="mt-12 text-center">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex items-center gap-2.5 rounded-none bg-ink px-8 py-4 text-sm font-medium uppercase tracking-caps text-paper transition-colors duration-200 hover:bg-gold hover:text-ink"
        >
          <LayoutGrid size={17} aria-hidden="true" />
          View the full menu
        </button>
      </Reveal>

      <AnimatePresence>
        {menuOpen && <FullMenuModal onClose={() => setMenuOpen(false)} onOpenProduct={(items, index) => setLb({ items, index })} />}
      </AnimatePresence>

      <AnimatePresence>
        {lb && (
          <ProductLightbox
            items={lb.items}
            index={lb.index}
            onClose={() => setLb(null)}
            onIndex={(i) => setLb((p) => (p ? { ...p, index: i } : p))}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
