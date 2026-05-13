import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
  x: number;
  y: number;
  onComplete?: () => void;
  duration?: number;
  color?: string;
}

export default function SpeechBubble({ text, x, y, onComplete, duration = 3000, color = '#fff' }: SpeechBubbleProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: y + 20 }}
        animate={{ opacity: 1, scale: 1, y: y }}
        exit={{ opacity: 0, scale: 0.8, y: y - 20 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          zIndex: 150,
          pointerEvents: 'none',
        }}
      >
        <div style={{
          background: 'rgba(5,3,10,0.9)',
          border: `2px solid ${color}`,
          borderRadius: '12px 12px 12px 0',
          padding: '8px 16px',
          color: '#fff',
          fontFamily: "'Cinzel', serif",
          fontSize: '0.8rem',
          maxWidth: 200,
          boxShadow: `0 0 15px ${color}44`,
          position: 'relative',
        }}>
          {text}
          {/* Bubble tail */}
          <div style={{
            position: 'absolute',
            bottom: -10,
            left: 0,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${color}`,
          }} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
