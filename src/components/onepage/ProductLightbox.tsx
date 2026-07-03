import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import DietaryTag from '@/components/catalog/DietaryTag';

export interface LightboxItem {
  name: string;
  image?: string;
  tags: string[];
  collection: string;
}

interface ProductLightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export default function ProductLightbox({ items, index, onClose, onIndex }: ProductLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const item = items[index];
  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  // Keep the active thumbnail centred in the filmstrip.
  useEffect(() => {
    stripRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [index]);

  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name}, ${item.collection}`}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-medium text-paper/60">{index + 1} / {items.length}</span>
        <button ref={closeRef} onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors duration-200 hover:bg-paper/25">
          <X size={20} />
        </button>
      </div>

      {/* Image — swipe (drag) to navigate */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={prev} aria-label="Previous" className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors duration-200 hover:bg-paper/25 sm:flex">
          <ChevronLeft size={22} />
        </button>

        <motion.div
          key={index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70 || info.velocity.x < -350) next();
            else if (info.offset.x > 70 || info.velocity.x > 350) prev();
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-3xl cursor-grab items-center justify-center active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {item.image && (
            <img src={item.image} alt={item.name} draggable={false} className="max-h-[58vh] w-auto rounded-none bg-paper object-contain p-4" />
          )}
        </motion.div>

        <button onClick={next} aria-label="Next" className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors duration-200 hover:bg-paper/25 sm:flex">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Caption */}
      <div className="px-5 pb-3 pt-4 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-medium uppercase tracking-caps text-gold">{item.collection}</p>
        <h3 className="mt-1.5 font-display text-2xl font-bold text-paper">{item.name}</h3>
        {item.tags.length > 0 && (
          <div className="mt-2.5 flex justify-center gap-1.5">
            {item.tags.map((t) => (
              <DietaryTag key={t} tag={t} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail filmstrip — swipe to browse the rest */}
      <div ref={stripRef} className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-6 pt-2 sm:justify-center" onClick={(e) => e.stopPropagation()}>
        {items.map((it, i) => (
          <button
            key={`${it.name}-${i}`}
            data-i={i}
            onClick={() => onIndex(i)}
            aria-label={`View ${it.name}`}
            aria-current={i === index}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-none bg-paper transition-all duration-200 ${
              i === index ? 'opacity-100 ring-2 ring-gold' : 'opacity-45 hover:opacity-90'
            }`}
          >
            {it.image && <img src={it.image} alt="" loading="lazy" className="h-full w-full object-contain p-1.5" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
