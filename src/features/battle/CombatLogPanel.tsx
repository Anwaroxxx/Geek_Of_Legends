// ============================================
// COMBAT LOG PANEL — Scrolling battle log
// ============================================
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBattleStore } from '../../store/battleStore';

export default function CombatLogPanel() {
  const combatLog = useBattleStore((s) => s.combatLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [combatLog]);

  const lastEntries = combatLog.slice(-20);

  const typeColors: Record<string, string> = {
    damage: '#f87171',
    heal: '#4ade80',
    crit: '#f59e0b',
    buff: '#60a5fa',
    debuff: '#c084fc',
    miss: '#8b7aa8',
    death: '#ef4444',
    phase: '#f97316',
    system: '#6b5a8a',
  };

  return (
    <div style={{
      position: 'absolute',
      top: 100, left: 12,
      width: 260,
      maxHeight: 200,
      zIndex: 40,
    }}>
      <div style={{
        padding: '6px 10px',
        background: 'rgba(5,3,10,0.85)',
        borderRadius: '8px 8px 0 0',
        borderBottom: '1px solid rgba(42,32,64,0.5)',
        fontFamily: "'Cinzel', serif",
        fontSize: '0.6rem',
        color: '#8b7aa8',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        📜 Combat Log
      </div>
      <div
        ref={scrollRef}
        style={{
          maxHeight: 160,
          overflow: 'auto',
          background: 'rgba(5,3,10,0.75)',
          borderRadius: '0 0 8px 8px',
          padding: '6px 8px',
          backdropFilter: 'blur(4px)',
        }}
      >
        {lastEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: '0.6rem',
              color: typeColors[entry.type] || '#e2d9f3',
              padding: '2px 0',
              borderBottom: '1px solid rgba(42,32,64,0.2)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: '#4a3d6b', marginRight: 4 }}>T{entry.turn}</span>
            {entry.message}
          </motion.div>
        ))}

        {lastEntries.length === 0 && (
          <p style={{ color: '#4a3d6b', fontSize: '0.6rem', fontStyle: 'italic', textAlign: 'center', padding: 8 }}>
            Battle awaits...
          </p>
        )}
      </div>
    </div>
  );
}
