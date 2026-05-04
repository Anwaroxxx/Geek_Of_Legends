// ============================================
// BOSS HEALTH BAR — no emojis, uses sprite mini
// ============================================
import { motion } from 'framer-motion';
import type { BossData, BossPhase } from '../../types/Game';
import { BOSS_COLORS } from '../../constants/balance';
import SpriteAnimator from '../../rendering/animation/SpriteAnimator';
import { CHARACTER_SPRITES } from '../../rendering/animation/SpriteConfig';

interface BossHealthBarProps {
  boss: BossData;
  currentPhase: BossPhase | undefined;
}

export default function BossHealthBar({ boss, currentPhase }: BossHealthBarProps) {
  const colors = BOSS_COLORS[boss.id] || BOSS_COLORS.sauron;
  const hpPercent = Math.max(0, (boss.stats.hp / boss.stats.maxHp) * 100);
  const bossSprites = CHARACTER_SPRITES[boss.id];

  return (
    <div style={{
      padding: '8px 16px', background: 'rgba(5,3,10,0.9)',
      borderRadius: 10, border: `1px solid ${colors.primary}33`,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mini boss sprite */}
          <div style={{
            width: 36, height: 36, overflow: 'hidden', borderRadius: 4,
            border: `1px solid ${colors.primary}44`, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {bossSprites && (
              <SpriteAnimator spriteSet={bossSprites} animation="idle" direction="down"
                scale={0.45} playing={true} />
            )}
          </div>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.9rem', fontWeight: 700,
              color: colors.primary, textShadow: `0 0 10px ${colors.glow}`,
            }}>{boss.name}</p>
            <p style={{
              fontSize: '0.6rem', color: '#8b7aa8', fontFamily: "'Cinzel', serif",
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{boss.title}</p>
          </div>
        </div>

        {currentPhase && (
          <motion.div key={currentPhase.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            style={{
              padding: '3px 10px', background: `${colors.secondary}44`,
              border: `1px solid ${colors.primary}44`, borderRadius: 4,
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem',
              color: colors.primary, letterSpacing: '0.06em',
            }}>
            Phase {currentPhase.id}: {currentPhase.name}
          </motion.div>
        )}

        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#e2d9f3' }}>
          {boss.stats.hp} / {boss.stats.maxHp}
        </span>
      </div>

      <div style={{
        width: '100%', height: 14, background: 'rgba(0,0,0,0.5)',
        borderRadius: 7, overflow: 'hidden', position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <motion.div animate={{ width: `${hpPercent}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: `${colors.primary}33`, borderRadius: 7 }} />
        <motion.div animate={{ width: `${hpPercent}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
            boxShadow: `0 0 12px ${colors.glow}`, borderRadius: 7,
          }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'rgba(255,255,255,0.15)', borderRadius: '7px 7px 0 0',
        }} />
        {boss.phases.slice(1).map((phase) => (
          <div key={phase.id} style={{
            position: 'absolute', left: `${phase.hpThreshold * 100}%`,
            top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.3)',
          }} />
        ))}
      </div>
    </div>
  );
}
