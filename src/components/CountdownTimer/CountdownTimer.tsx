import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './CountdownTimer.css';

interface Props {
  onDone: () => void;
}

export function CountdownTimer({ onDone }: Props) {
  const [count, setCount] = useState<number | string>(3);

  useEffect(() => {
    const steps: (number | string)[] = [3, 2, 1, '📸'];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) { onDone(); return; }
      setCount(steps[i++]);
      setTimeout(tick, i < steps.length ? 900 : 400);
    };
    tick();
  }, [onDone]);

  return (
    <div className="countdown-overlay">
      <AnimatePresence mode="wait">
        <motion.div
          key={String(count)}
          className="countdown-number"
          initial={{ scale: 1.8, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          exit={{   scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {count}
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="countdown-ring"
        initial={{ opacity: 0.8, scale: 1 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 0.9, ease: 'easeOut', repeat: Infinity, repeatDelay: 0 }}
      />
    </div>
  );
}
