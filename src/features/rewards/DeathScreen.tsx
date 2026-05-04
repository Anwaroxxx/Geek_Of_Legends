// ============================================
// DEATH SCREEN
// ============================================
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useBattleStore } from '../../store/battleStore';
import { useHeroStore } from '../../store/heroStore';

export default function DeathScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const resetBattle = useBattleStore((s) => s.resetBattle);
  const resetForBattle = useHeroStore((s) => s.resetForBattle);
  const boss = useBattleStore((s) => s.boss);

  const handleRetry = () => {
    resetBattle();
    resetForBattle();
    setPhase('battle');
  };

  const handleMenu = () => {
    resetBattle();
    setPhase('menu');
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #0a0303 0%, #1a0505 30%, #200808 50%, #0a0303 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blood-red vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(139,0,0,0.2) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Skull icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: [0.17, 0.67, 0.35, 1] }}
        style={{
          fontSize: '6rem', marginBottom: 20,
          filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.5))',
          zIndex: 2,
        }}
      >
        💀
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900, color: '#ef4444',
          textShadow: '0 0 30px rgba(239,68,68,0.8), 0 0 60px rgba(239,68,68,0.4)',
          marginBottom: 10, zIndex: 2,
        }}
      >
        Defeat
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.95rem',
          color: '#8b7aa8', marginBottom: 40, zIndex: 2, textAlign: 'center',
        }}
      >
        {boss ? `${boss.name} has claimed your souls...` : 'Your party has fallen...'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        style={{ display: 'flex', gap: 16, zIndex: 2 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239,68,68,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRetry}
          style={{
            padding: '14px 40px',
            background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
            border: '1px solid #ef4444', borderRadius: 6,
            fontFamily: "'Cinzel', serif", fontSize: '0.95rem', fontWeight: 700,
            color: '#fecaca', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >⚔️ Retry</motion.button>

        <motion.button
          whileHover={{ scale: 1.03, borderColor: '#8b7aa8' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleMenu}
          style={{
            padding: '14px 40px',
            background: 'transparent',
            border: '1px solid #4a3d6b', borderRadius: 6,
            fontFamily: "'Cinzel', serif", fontSize: '0.95rem', fontWeight: 600,
            color: '#8b7aa8', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >🏚 Menu</motion.button>
      </motion.div>
    </div>
  );
}
