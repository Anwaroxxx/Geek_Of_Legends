// ============================================
// BATTLE HUD — Hero status panels (no emojis)
// ============================================
import { motion } from 'framer-motion';
import type { HeroData } from '../../types/Game';
import { HERO_COLORS, STATUS_ICONS } from '../../constants/balance';
import SpriteAnimator from '../../rendering/animation/SpriteAnimator';
import { CHARACTER_SPRITES } from '../../rendering/animation/SpriteConfig';

interface BattleHUDProps {
  heroes: HeroData[];
  currentHeroId: string | null;
  turnCount: number;
  isPlayerTurn: boolean;
}

const CLASS_LABELS: Record<string, string> = {
  warrior: 'Warrior',
  mage: 'Mage',
  archer: 'Archer',
};

const CLASS_COLORS: Record<string, string> = {
  warrior: '#ef4444',
  mage: '#8b5cf6',
  archer: '#10b981',
};

export default function BattleHUD({ heroes, currentHeroId, turnCount, isPlayerTurn }: BattleHUDProps) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: 8,
      padding: '8px 12px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(5,3,10,0.95) 30%)',
    }}>
      {heroes.map((hero) => (
        <HeroPanel key={hero.id} hero={hero} isActive={hero.id === currentHeroId && isPlayerTurn} />
      ))}
    </div>
  );
}

function HeroPanel({ hero, isActive }: { hero: HeroData; isActive: boolean }) {
  const color = CLASS_COLORS[hero.heroClass] || '#fff';
  const hpPercent = Math.max(0, (hero.stats.hp / hero.stats.maxHp) * 100);
  const mpPercent = Math.max(0, (hero.stats.mp / hero.stats.maxMp) * 100);
  const spriteSet = CHARACTER_SPRITES[hero.heroClass];

  const resourceBar = hero.heroClass === 'warrior'
    ? { value: hero.rage ?? 0, max: hero.maxRage ?? 100, color: '#ef4444', label: 'Rage' }
    : hero.heroClass === 'archer'
    ? { value: hero.arrows ?? 0, max: hero.maxArrows ?? 20, color: '#10b981', label: 'Arrows' }
    : null;

  return (
    <motion.div
      animate={isActive ? { borderColor: color } : { borderColor: 'rgba(42,32,64,0.8)' }}
      style={{
        width: 180, padding: '8px 10px',
        background: isActive
          ? `linear-gradient(135deg, ${color}11 0%, rgba(13,10,24,0.95) 100%)`
          : 'rgba(13,10,24,0.95)',
        border: '1px solid rgba(42,32,64,0.8)',
        borderRadius: 8, position: 'relative', overflow: 'hidden',
        opacity: hero.isAlive ? 1 : 0.4,
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }} />
      )}

      {/* Hero info with mini sprite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div style={{
          width: 32, height: 32, overflow: 'hidden',
          borderRadius: 4, border: `1px solid ${color}33`,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {spriteSet && (
            <SpriteAnimator
              spriteSet={spriteSet}
              animation="idle"
              direction="down"
              scale={hero.heroClass === 'warrior' ? 0.22 : 0.4}
              playing={true}
              style={{ marginTop: hero.heroClass === 'warrior' ? -4 : 0 }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.7rem', fontWeight: 700,
            color: isActive ? color : '#e2d9f3',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {hero.name}
          </p>
          <p style={{
            fontSize: '0.55rem', color: '#6b5a8a',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Lv.{hero.level} {CLASS_LABELS[hero.heroClass]}
          </p>
        </div>
      </div>

      {/* HP Bar */}
      <div style={{ marginBottom: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', marginBottom: 2 }}>
          <span style={{ color: '#4ade80' }}>HP</span>
          <span style={{ color: '#8b7aa8' }}>{hero.stats.hp}/{hero.stats.maxHp}</span>
        </div>
        <div className="bar-container" style={{ height: 6 }}>
          <div className="bar-hp">
            <div className="bar-fill" style={{
              width: `${hpPercent}%`,
              background: hpPercent < 25 ? 'linear-gradient(90deg, #991b1b, #ef4444)'
                : hpPercent < 50 ? 'linear-gradient(90deg, #b45309, #f59e0b)'
                : 'linear-gradient(90deg, #16a34a, #4ade80)',
              boxShadow: hpPercent < 25 ? '0 0 8px rgba(239,68,68,0.6)' : '0 0 8px rgba(74,222,128,0.4)',
            }} />
          </div>
        </div>
      </div>

      {/* MP Bar */}
      <div style={{ marginBottom: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', marginBottom: 2 }}>
          <span style={{ color: '#60a5fa' }}>MP</span>
          <span style={{ color: '#8b7aa8' }}>{hero.stats.mp}/{hero.stats.maxMp}</span>
        </div>
        <div className="bar-container" style={{ height: 4 }}>
          <div className="bar-mana">
            <div className="bar-fill" style={{ width: `${mpPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Resource */}
      {resourceBar && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', marginBottom: 2 }}>
            <span style={{ color: resourceBar.color }}>{resourceBar.label}</span>
            <span style={{ color: '#8b7aa8' }}>{resourceBar.value}/{resourceBar.max}</span>
          </div>
          <div className="bar-container" style={{ height: 4 }}>
            <div>
              <div className="bar-fill" style={{
                width: `${(resourceBar.value / resourceBar.max) * 100}%`,
                background: `linear-gradient(90deg, ${resourceBar.color}99, ${resourceBar.color})`,
                boxShadow: `0 0 6px ${resourceBar.color}66`,
              }} />
            </div>
          </div>
        </div>
      )}

      {hero.statusEffects.length > 0 && (
        <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap' }}>
          {hero.statusEffects.map((eff, i) => (
            <span key={i} style={{
              fontSize: '0.6rem', padding: '1px 4px',
              background: 'rgba(0,0,0,0.3)', borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.05)',
              color: '#e2d9f3',
            }}>
              {eff.type} {eff.duration}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
