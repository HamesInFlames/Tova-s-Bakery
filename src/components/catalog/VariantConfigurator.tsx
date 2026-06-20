import { useState, useEffect, useRef, useCallback } from 'react';
import type { VariantItem } from '@/data/content';
import VariantImage from './VariantImage';
import VariantList from './VariantList';

const ROTATION_INTERVAL = 4000;
const CLICK_PAUSE = 5000;
const HOVER_RESUME = 2000;

export default function VariantConfigurator({ items }: { items: VariantItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPause = useCallback(() => {
    if (pauseTimer.current) {
      clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || paused || items.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(id);
  }, [paused, items.length]);

  useEffect(() => () => clearPause(), [clearPause]);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      clearPause();
      setPaused(true);
      pauseTimer.current = setTimeout(() => setPaused(false), CLICK_PAUSE);
    },
    [clearPause],
  );

  const onEnter = useCallback(() => {
    clearPause();
    setPaused(true);
  }, [clearPause]);

  const onLeave = useCallback(() => {
    clearPause();
    pauseTimer.current = setTimeout(() => setPaused(false), HOVER_RESUME);
  }, [clearPause]);

  const current = items[activeIndex] ?? items[0];
  if (!current) return null;

  return (
    <div className="grid items-start gap-8 md:grid-cols-2" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <VariantImage src={current.image} alt={current.name} />
      <VariantList items={items} activeIndex={activeIndex} onSelect={handleSelect} />
    </div>
  );
}
