import { useRef, useCallback } from 'react';
import type { VariantItem } from '@/data/content';
import DietaryTag from './DietaryTag';

interface VariantListProps {
  items: VariantItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

// No prices — Tova's is a brochure catalog. The dot-leader runs to a subtle
// active marker; dietary tags (GF/SF/Dairy/Parve) sit inline.
export default function VariantList({ items, activeIndex, onSelect }: VariantListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        next = (index + 1) % items.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        next = (index - 1 + items.length) % items.length;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(index);
        return;
      } else {
        return;
      }
      onSelect(next);
      const rows = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
      rows?.[next]?.focus();
    },
    [items.length, onSelect],
  );

  return (
    <div ref={listRef} className="flex flex-col" role="listbox" aria-label="Varieties">
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={`${item.name}-${i}`}
            type="button"
            role="option"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`variant-row ${isActive ? 'font-bold text-ink' : 'text-ink hover:opacity-70'}`}
          >
            <span className="font-sans text-[0.95rem]">{item.name}</span>
            <span className="variant-row__leader" aria-hidden="true" />
            <span className="flex items-center gap-1.5">
              {item.tags.map((t) => (
                <DietaryTag key={t} tag={t} />
              ))}
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
