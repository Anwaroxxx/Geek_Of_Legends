// ============================================
// BOSS INTRO — Cinematic entrance with real sprite
// ============================================
import { motion } from 'framer-motion';
import type { BossData } from '../../types/Game';
import { BOSS_COLORS } from '../../constants/balance';
import SpriteAnimator from '../../rendering/animation/SpriteAnimator';
import { CHARACTER_SPRITES } from '../../rendering/animation/SpriteConfig';

interface BossIntroProps {
  boss: BossData;
}

export default function BossIntro({ boss }: BossIntroProps) {
  const colors = BOSS_COLORS[boss.id] || BOSS_COLORS.sauron;
  const bossSprites = CHARACTER_SPRITES[boss.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.94)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow */}
      <motion.div
        animate={{ scale: [0.5, 1.3], opacity: [0, 0.3, 0] }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Rotating rune ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', width: 350, height: 350,
          border: `1px solid ${colors.primary}22`, borderRadius: '50%',
        }}
      >
        <div style={{
          position: 'absolute', inset: 20,
          border: `1px dashed ${colors.primary}15`, borderRadius: '50%',
        }} />
      </motion.div>

      {/* Boss sprite (animated!) */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0, filter: 'brightness(3)' }}
        animate={{ scale: 1, opacity: 1, filter: 'brightness(1)' }}
        transition={{ duration: 1.2, ease: [0.17, 0.67, 0.35, 1] }}
        style={{
          marginBottom: 20, position: 'relative', zIndex: 2,
          filter: `drop-shadow(0 0 30px ${colors.glow})`,
        }}
      >
        {bossSprites && (
          <SpriteAnimator
            spriteSet={bossSprites}
            animation="idle"
            direction="down"
            scale={5}
            playing={true}
          />
        )}
      </motion.div>

      {/* Boss name */}
      <motion.h1
        initial={{ opacity: 0, y: 20, letterSpacing: '0.5em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.15em' }}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900, color: colors.primary,
          textShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
          position: 'relative', zIndex: 2,
        }}
      >
        {boss.name}
      </motion.h1>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{
          fontFamily: "'Cinzel', serif", fontSize: '1.2rem',
          color: '#8b7aa8', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginTop: 8, position: 'relative', zIndex: 2,
        }}
      >
        {boss.title}
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          width: 180, height: 1, margin: '20px 0',
          background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
          position: 'relative', zIndex: 2,
        }}
      />

      {/* Phase */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ delay: 1.5, duration: 2 }}
        style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.85rem',
          color: colors.primary, letterSpacing: '0.15em',
          position: 'relative', zIndex: 2,
        }}
      >
        Phase I: {boss.phases[0]?.name || 'Unknown'}
      </motion.p>
    </motion.div>
  );
}
