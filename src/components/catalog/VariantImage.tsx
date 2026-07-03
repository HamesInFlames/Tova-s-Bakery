import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface VariantImageProps {
  src?: string;
  alt: string;
}

export default function VariantImage({ src, alt }: VariantImageProps) {
  const reduced = useReducedMotion();
  const fade = reduced
    ? { initial: {}, animate: {}, exit: {} }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-none border border-ink/15 bg-paper"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {src ? (
          <motion.img
            key={src}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain p-4"
            {...fade}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.div
            key="placeholder"
            className="absolute inset-0 flex items-center justify-center font-display text-xl text-ink/50"
            {...fade}
            transition={{ duration: 0.2 }}
          >
            {alt}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
