'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
}

export function AnimateOnScroll({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = '' 
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getVariants = () => {
    switch (direction) {
      // Keep content visible while the observer is waiting for hydration.
      case 'up': return { hidden: { opacity: 1, y: 50 }, visible: { opacity: 1, y: 0 } };
      case 'down': return { hidden: { opacity: 1, y: -50 }, visible: { opacity: 1, y: 0 } };
      case 'left': return { hidden: { opacity: 1, x: 50 }, visible: { opacity: 1, x: 0 } };
      case 'right': return { hidden: { opacity: 1, x: -50 }, visible: { opacity: 1, x: 0 } };
      case 'none': return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
      default: return { hidden: { opacity: 1, y: 50 }, visible: { opacity: 1, y: 0 } };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
