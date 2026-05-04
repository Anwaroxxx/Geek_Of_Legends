// ============================================
// FLOATING DAMAGE TEXT — Animated combat numbers
// ============================================
import { motion, AnimatePresence } from 'framer-motion';
import type { FloatingText } from '../../types/Game';

interface FloatingDamageProps {
  texts: FloatingText[];
}

export default function FloatingDamage({ texts }: FloatingDamageProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 80 }}>
      <AnimatePresence>
        {texts.map((ft) => (
          <motion.div
            key={ft.id}
            initial={{
              x: ft.x,
              y: ft.y,
              opacity: 1,
              scale: ft.type === 'crit' ? 0.3 : 0.8,
            }}
            animate={{
              y: ft.y - (ft.type === 'crit' ? 100 : 70),
              opacity: 0,
              scale: ft.type === 'crit' ? 1.3 : 1,
              rotate: ft.type === 'crit' ? [0, -8, 5, 0] : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              fontFamily: "'Cinzel', serif",
              fontWeight: 900,
              whiteSpace: 'nowrap',
              ...(ft.type === 'crit' ? {
                fontSize: '2rem',
                color: '#f59e0b',
                textShadow: '0 0 20px rgba(245,158,11,0.9), 0 0 40px rgba(245,158,11,0.5), 0 2px 0 #000',
              } : ft.type === 'heal' ? {
                fontSize: '1.4rem',
                color: '#4ade80',
                textShadow: '0 0 12px rgba(74,222,128,0.6)',
              } : ft.type === 'poison' ? {
                fontSize: '1.2rem',
                color: '#a3e635',
                textShadow: '0 0 10px rgba(163,230,53,0.5)',
              } : ft.type === 'miss' ? {
                fontSize: '1.1rem',
                color: '#8b7aa8',
                fontStyle: 'italic',
                fontWeight: 600,
              } : {
                fontSize: '1.5rem',
                color: '#ffffff',
                textShadow: '0 0 8px rgba(255,255,255,0.4), 0 2px 0 #000',
              }),
            }}
          >
            {ft.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
