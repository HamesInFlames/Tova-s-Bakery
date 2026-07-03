import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { categories } from '@/data/content';
import DietaryTag from '@/components/catalog/DietaryTag';
import type { LightboxItem } from './ProductLightbox';

const TOTAL = categories.reduce((n, c) => n + c.sections.reduce((m, s) => m + s.items.length, 0), 0);

interface FullMenuModalProps {
  onClose: () => void;
  onOpenProduct: (items: LightboxItem[], index: number) => void;
}

// The full menu, organized by collection → sub-collection, with a stationary
// category bar that jumps you to any collection.
export default function FullMenuModal({ onClose, onOpenProduct }: FullMenuModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(categories[0].slug);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Highlight the collection currently in view.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.getAttribute('data-cat') || ''); }),
      { root, rootMargin: '0px 0px -78% 0px', threshold: 0 },
    );
    root.querySelectorAll('[data-cat]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Keep the active chip visible in the (scrollable) category bar.
  useEffect(() => {
    navRef.current?.querySelector<HTMLElement>(`[data-navcat="${active}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  const jump = (slug: string) => {
    bodyRef.current?.querySelector(`[data-cat="${slug}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full menu"
    >
      <motion.div
        className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-none border border-ink/15 bg-paper"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 px-6 pt-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-caps text-ink/60">Full Menu</p>
            <h2 className="font-display text-2xl font-bold text-ink">{TOTAL} varieties, all nut-free</h2>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors duration-200 hover:bg-ink hover:text-paper">
            <X size={20} />
          </button>
        </header>

        {/* Stationary category bar */}
        <div ref={navRef} className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto border-b border-ink/15 px-6 py-4">
          {categories.map((c) => {
            const on = c.slug === active;
            return (
              <button
                key={c.slug}
                data-navcat={c.slug}
                onClick={() => jump(c.slug)}
                aria-current={on}
                className={`whitespace-nowrap rounded-none px-4 py-2 text-xs font-medium uppercase tracking-caps transition-colors duration-200 ${
                  on ? 'bg-ink text-paper' : 'border border-ink/20 text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          {categories.map((cat) => {
            const items: LightboxItem[] = cat.sections.flatMap((s) =>
              s.items.map((it) => ({ name: it.name, image: it.image, tags: it.tags, collection: s.heading })),
            );
            let idx = -1;
            return (
              <div key={cat.slug} data-cat={cat.slug} className="mb-12 scroll-mt-4 last:mb-2">
                <div className="mb-5 flex items-baseline gap-3">
                  <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{cat.title}</h3>
                  <span className="text-sm text-ink/70">{items.length}</span>
                </div>
                {cat.sections
                  .filter((s) => s.items.length > 0)
                  .map((sub) => (
                    <div key={sub.heading} className="mb-7 last:mb-0">
                      <p className="mb-3 text-xs font-medium uppercase tracking-caps text-ink/60">{sub.heading}</p>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                        {sub.items.map((it) => {
                          idx += 1;
                          const myIdx = idx;
                          return (
                            <button
                              key={`${it.name}-${myIdx}`}
                              type="button"
                              onClick={() => onOpenProduct(items, myIdx)}
                              aria-label={`View ${it.name}`}
                              className="group/m text-left"
                            >
                              <div className="aspect-square overflow-hidden rounded-none bg-paper ring-1 ring-ink/10 transition-all duration-200 group-hover/m:-translate-y-0.5 group-hover/m:ring-ink/40">
                                {it.image && (
                                  <img src={it.image} alt="" loading="lazy" className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover/m:scale-110" />
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-1">
                                <p className="truncate text-xs font-medium text-ink">{it.name}</p>
                                {it.tags.map((t) => (
                                  <DietaryTag key={t} tag={t} />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
