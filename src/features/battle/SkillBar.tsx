// ============================================
// SKILL BAR — Ability buttons (no emojis in display)
// ============================================
import { motion } from 'framer-motion';
import { 
  Sword, Shield, Zap, Flame, Snowflake, 
  Orbit, Skull, ArrowUpRight, Crosshair, 
  Droplets, CloudRain, Wind 
} from 'lucide-react';
import type { HeroData, Skill } from '../../types/Game';
import { HERO_COLORS } from '../../constants/balance';

interface SkillBarProps {
  hero: HeroData;
  onUseSkill: (skill: Skill) => void;
  onPassTurn: () => void;
  disabled: boolean;
}

const SKILL_ICON_MAP: Record<string, React.ReactNode> = {
  slash: <Sword size={16} />,
  shield_wall: <Shield size={16} />,
  titan_cleave: <Zap size={16} />,
  berserk_mode: <Flame size={16} />,
  fireball: <Flame size={16} />,
  ice_prison: <Snowflake size={16} />,
  arcane_beam: <Orbit size={16} />,
  meteor: <Orbit size={16} />,
  piercing_shot: <Crosshair size={16} />,
  poison_arrow: <Droplets size={16} />,
  rain_of_arrows: <CloudRain size={16} />,
  blink: <Wind size={16} />,
};

export default function SkillBar({ hero, onUseSkill, onPassTurn, disabled }: SkillBarProps) {
  const colors = HERO_COLORS[hero.heroClass];

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
      style={{
        display: 'flex', justifyContent: 'center', gap: 8,
        padding: '10px 20px 14px',
        background: 'rgba(5,3,10,0.98)',
        borderTop: '1px solid rgba(42,32,64,0.5)',
      }}
    >
      {hero.skills.map((skill) => {
        const onCooldown = skill.currentCooldown > 0;
        const notEnoughMp = skill.mpCost > hero.stats.mp;
        const notEnoughRage = skill.rageCost !== undefined && skill.rageCost > 0 && (hero.rage ?? 0) < skill.rageCost;
        const notEnoughArrows = skill.arrowCost !== undefined && skill.arrowCost > 0 && (hero.arrows ?? 0) < skill.arrowCost;
        const isDisabled = disabled || onCooldown || notEnoughMp || notEnoughRage || notEnoughArrows || !hero.isAlive;

        return (
          <motion.button
            key={skill.id}
            whileHover={!isDisabled ? { y: -4, boxShadow: `0 0 20px ${colors.glow}` } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={() => !isDisabled && onUseSkill(skill)}
            style={{
              width: 110, padding: '8px 6px',
              background: isDisabled
                ? 'rgba(18,14,34,0.5)'
                : `linear-gradient(135deg, ${colors.secondary}44 0%, rgba(18,14,34,0.9) 100%)`,
              border: `1px solid ${isDisabled ? 'rgba(42,32,64,0.4)' : colors.primary + '55'}`,
              borderRadius: 8, cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.45 : 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease',
            }}
          >
            {onCooldown && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Cinzel', serif", fontSize: '1.2rem', fontWeight: 900,
                color: '#ef4444', textShadow: '0 0 8px rgba(239,68,68,0.5)', zIndex: 2,
              }}>{skill.currentCooldown}</div>
            )}

            {/* Skill icon */}
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: `linear-gradient(135deg, ${colors.primary}33, ${colors.secondary}66)`,
              border: `1px solid ${colors.primary}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.primary,
            }}>
              {SKILL_ICON_MAP[skill.id] || <Sword size={16} />}
            </div>

            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem', fontWeight: 600,
              color: '#e2d9f3', whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis', maxWidth: '100%',
            }}>{skill.name}</span>

            <span style={{
              fontSize: '0.5rem',
              color: notEnoughMp || notEnoughRage || notEnoughArrows ? '#ef4444' : '#8b7aa8',
            }}>
              {skill.mpCost > 0 && `${skill.mpCost} MP`}
              {skill.rageCost && skill.rageCost > 0 && `${skill.rageCost} Rage`}
              {skill.arrowCost && skill.arrowCost > 0 && `${skill.arrowCost} Arrows`}
              {skill.mpCost === 0 && !skill.rageCost && !skill.arrowCost && 'Free'}
            </span>

            {skill.baseDamage > 0 && (
              <span style={{ fontSize: '0.5rem', color: colors.primary }}>
                DMG {skill.baseDamage}
              </span>
            )}
          </motion.button>
        );
      })}

      {/* Pass Turn Button */}
      <motion.button
        whileHover={!disabled ? { y: -4, boxShadow: `0 0 20px rgba(139,122,168,0.4)` } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={() => !disabled && onPassTurn()}
        style={{
          width: 80, padding: '8px 6px',
          background: disabled ? 'rgba(18,14,34,0.5)' : 'linear-gradient(135deg, rgba(42,32,64,0.5) 0%, rgba(18,14,34,0.9) 100%)',
          border: `1px solid ${disabled ? 'rgba(42,32,64,0.4)' : '#6b5a8a'}`,
          borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: 'rgba(0,0,0,0.3)', border: '1px solid #4a3d6b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#8b7aa8',
        }}>
          <Wind size={16} />
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.6rem', fontWeight: 600,
          color: '#8b7aa8', whiteSpace: 'nowrap',
        }}>Pass</span>
        <span style={{ fontSize: '0.5rem', color: '#6b5a8a' }}>Recover</span>
      </motion.button>
    </motion.div>
  );
}
