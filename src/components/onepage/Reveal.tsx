import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

// Quiet, intentional scroll reveal (fade + rise). Animates once. Honors reduced
// motion via the global MotionConfig reducedMotion="user".
export default function Reveal({ children, className, delay = 0, y = 12 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
