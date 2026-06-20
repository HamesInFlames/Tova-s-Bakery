import { motion } from 'motion/react';

// Slow-breathing warm (honey) glow behind the hero logo. Decorative; honors
// reduced motion via the global MotionConfig.
export function AmbientGlow() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      animate={{ opacity: [0.35, 0.6, 0.35] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(55% 45% at 50% 40%, rgba(201,138,43,0.20), transparent 70%)' }}
      />
    </motion.div>
  );
}
