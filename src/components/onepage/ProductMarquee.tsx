import DietaryTag from '@/components/catalog/DietaryTag';
import type { LightboxItem } from './ProductLightbox';

interface ProductMarqueeProps {
  items: LightboxItem[];
  reverse?: boolean;
  onOpen: (index: number) => void;
}

// An auto-scrolling rail of large product cards. The set is duplicated so the
// CSS loop (translateX -50%) is seamless. Hover/focus pauses it; reduced-motion
// turns it into a normal scroll strip. Tap a card to open the lightbox.
export default function ProductMarquee({ items, reverse = false, onOpen }: ProductMarqueeProps) {
  if (!items.length) return null;
  const row = [...items, ...items];
  const duration = Math.max(28, Math.round(items.length * 4.5)); // ~constant speed

  return (
    <div className="rail">
      <ul
        className={`rail__track gap-5 px-6 ${reverse ? 'rail__track--reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {row.map((it, i) => {
          const idx = i % items.length;
          const isClone = i >= items.length;
          return (
            <li key={i} className="shrink-0" aria-hidden={isClone || undefined}>
              <button
                type="button"
                onClick={() => onOpen(idx)}
                aria-label={`View ${it.name}`}
                tabIndex={isClone ? -1 : 0}
                className="group/card block w-44 text-left sm:w-56"
              >
                <div className="aspect-square overflow-hidden rounded-none bg-paper ring-1 ring-ink/10 transition-all duration-200 group-hover/card:-translate-y-1 group-hover/card:ring-ink/40">
                  {it.image && (
                    <img
                      src={it.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-4 transition-transform duration-300 ease-out group-hover/card:scale-110"
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-medium text-ink">{it.name}</p>
                  {it.tags.map((t) => (
                    <DietaryTag key={t} tag={t} />
                  ))}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
