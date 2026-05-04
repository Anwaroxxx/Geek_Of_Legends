// ============================================
// PARTY CREATION — with real sprites
// ============================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useHeroStore } from '../../store/heroStore';
import type { HeroClass } from '../../types/Game';
import { HERO_COLORS } from '../../constants/balance';
import SpriteAnimator from '../../rendering/animation/SpriteAnimator';
import { CHARACTER_SPRITES } from '../../rendering/animation/SpriteConfig';

const CLASS_DATA: Record<HeroClass, {
  name: string; desc: string; traits: string[]; resource: string; color: string;
}> = {
  warrior: {
    name: 'Vanguard Warrior', color: HERO_COLORS.warrior.primary,
    desc: 'A brutal front-line fighter wielding massive weapons. Builds rage through combat.',
    traits: ['High HP', 'High Defense', 'Rage System', 'Close Combat'],
    resource: 'Rage',
  },
  mage: {
    name: 'Arcane Mage', color: HERO_COLORS.mage.primary,
    desc: 'A master of elemental magic who channels devastating spells. Burns mana for arcane fury.',
    traits: ['High Magic DMG', 'Crowd Control', 'Mana System', 'AOE Spells'],
    resource: 'Mana',
  },
  archer: {
    name: 'Shadow Ranger', color: HERO_COLORS.archer.primary,
    desc: 'A lethal marksman from the shadows. Uses arrows wisely and strikes with precision.',
    traits: ['High Crit', 'High Dodge', 'Arrow System', 'Ranged DPS'],
    resource: 'Arrows',
  },
};

const ALL_CLASSES: HeroClass[] = ['warrior', 'mage', 'archer'];

export default function PartyCreation() {
  const { setPhase, setCurrentBoss } = useGameStore();
  const { heroes, createHero, removeHero, clearParty } = useHeroStore();
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null);
  const [heroName, setHeroName] = useState('');
  const [error, setError] = useState('');

  const handleAddHero = () => {
    if (!selectedClass) { setError('Select a class'); return; }
    if (!heroName.trim()) { setError('Enter a name'); return; }
    if (heroName.trim().length > 16) { setError('Name too long (max 16)'); return; }
    if (heroes.length >= 3) { setError('Party is full'); return; }
    createHero(heroName.trim(), selectedClass);
    setHeroName('');
    setSelectedClass(null);
    setError('');
  };

  const canStart = heroes.length === 3;

  const handleStartRaid = () => {
    if (!canStart) return;
    const bosses: ('sauron' | 'chronos' | 'lilith')[] = ['sauron', 'chronos', 'lilith'];
    const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];
    setCurrentBoss(randomBoss);
    setPhase('battle');
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #05030a 0%, #0d0a18 50%, #120a22 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px', overflow: 'auto',
    }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: '#c5a059', textShadow: '0 0 20px rgba(197,160,89,0.5)', marginBottom: 8,
        }}>Forge Your Party</h1>
        <p style={{ color: '#8b7aa8', fontFamily: "'Cinzel', serif", fontSize: '0.9rem', letterSpacing: '0.15em' }}>
          SELECT 3 HEROES FOR YOUR RAID
        </p>
        <div style={{ width: 160, height: 1, margin: '12px auto 0', background: 'linear-gradient(90deg, transparent, #c5a059, transparent)' }} />
      </motion.div>

      {/* Class cards with sprites */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 30, maxWidth: 900 }}>
        {ALL_CLASSES.map((cls, idx) => {
          const data = CLASS_DATA[cls];
          const isSelected = selectedClass === cls;
          const spriteSet = CHARACTER_SPRITES[cls];

          return (
            <motion.div
              key={cls}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -4, boxShadow: `0 0 30px ${HERO_COLORS[cls].glow}` }}
              onClick={() => { setSelectedClass(cls); setError(''); }}
              style={{
                width: 250, padding: '20px 20px 16px',
                background: isSelected
                  ? `linear-gradient(135deg, ${HERO_COLORS[cls].secondary} 0%, #120e22 100%)`
                  : 'linear-gradient(135deg, #120e22 0%, #0f0a1e 100%)',
                border: `1px solid ${isSelected ? data.color : '#2a2040'}`,
                borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: isSelected ? `0 0 25px ${HERO_COLORS[cls].glow}` : '0 8px 32px rgba(0,0,0,0.6)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${data.color}88, transparent)` }} />

              {/* Sprite preview */}
              <div style={{
                display: 'flex', justifyContent: 'center', marginBottom: 12,
                height: 80, overflow: 'hidden', alignItems: 'center',
              }}>
                {spriteSet && (
                  <SpriteAnimator
                    spriteSet={spriteSet}
                    animation="idle"
                    direction="down"
                    scale={cls === 'warrior' ? 0.6 : 1}
                    playing={true}
                  />
                )}
              </div>

              <h3 style={{
                fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: 700,
                color: isSelected ? data.color : '#e2d9f3', textAlign: 'center', marginBottom: 8,
              }}>{data.name}</h3>
              <p style={{ fontSize: '0.75rem', color: '#8b7aa8', textAlign: 'center', lineHeight: 1.5, marginBottom: 12 }}>
                {data.desc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                {data.traits.map((t) => (
                  <span key={t} style={{
                    padding: '2px 8px', background: 'rgba(255,255,255,0.05)',
                    borderRadius: 4, fontSize: '0.65rem', color: '#6b5a8a',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>{t}</span>
                ))}
              </div>

              <div style={{ marginTop: 10, textAlign: 'center', fontSize: '0.7rem', color: data.color, fontFamily: "'Cinzel', serif", letterSpacing: '0.1em' }}>
                Resource: {data.resource}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Name Input */}
      <AnimatePresence>
        {selectedClass && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <input type="text" value={heroName} onChange={(e) => setHeroName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHero()}
              placeholder={`Name your ${CLASS_DATA[selectedClass].name}...`} maxLength={16}
              style={{
                width: 260, padding: '10px 16px', background: 'rgba(18,14,34,0.8)',
                border: '1px solid #2a2040', borderRadius: 6, color: '#e2d9f3',
                fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none',
              }} />
            <button onClick={handleAddHero} className="btn btn-primary" style={{ padding: '10px 20px' }}>Add Hero</button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}

      {/* Current Party with sprites */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
        {heroes.map((hero) => {
          const spriteSet = CHARACTER_SPRITES[hero.heroClass];
          return (
            <motion.div key={hero.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} layout
              style={{
                width: 200, padding: 16,
                background: 'linear-gradient(135deg, #120e22 0%, #0f0a1e 100%)',
                border: `1px solid ${HERO_COLORS[hero.heroClass].primary}55`,
                borderRadius: 10, textAlign: 'center', position: 'relative',
              }}>
              <button onClick={() => removeHero(hero.id)}
                style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>
                x
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', height: 60, alignItems: 'center', overflow: 'hidden' }}>
                {spriteSet && (
                  <SpriteAnimator spriteSet={spriteSet} animation="idle" direction="down"
                    scale={hero.heroClass === 'warrior' ? 0.5 : 0.8} playing={true} />
                )}
              </div>
              <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: HERO_COLORS[hero.heroClass].primary, fontSize: '0.9rem' }}>
                {hero.name}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#8b7aa8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {CLASS_DATA[hero.heroClass].name}
              </p>
            </motion.div>
          );
        })}

        {Array.from({ length: 3 - heroes.length }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            width: 200, height: 130, border: '1px dashed #2a2040',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#4a3d6b', fontSize: '0.8rem',
          }}>Empty Slot</div>
        ))}
      </div>

      {/* Start */}
      <motion.button
        whileHover={canStart ? { scale: 1.05, boxShadow: '0 0 50px rgba(197,160,89,0.6)' } : {}}
        whileTap={canStart ? { scale: 0.97 } : {}}
        onClick={handleStartRaid}
        disabled={!canStart}
        style={{
          width: 300, padding: '16px 40px',
          background: canStart ? 'linear-gradient(135deg, #7c4f12 0%, #c5a059 50%, #7c4f12 100%)' : '#1a1030',
          backgroundSize: '200% 100%',
          border: canStart ? 'none' : '1px solid #2a2040',
          borderRadius: 6, fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700,
          color: canStart ? '#0a0800' : '#4a3d6b', letterSpacing: '0.12em', textTransform: 'uppercase',
          cursor: canStart ? 'pointer' : 'not-allowed',
          animation: canStart ? 'shimmer 3s linear infinite' : 'none',
          boxShadow: canStart ? '0 0 25px rgba(197,160,89,0.4)' : 'none',
        }}
      >
        {canStart ? 'Begin the Raid' : `Select ${3 - heroes.length} more`}
      </motion.button>

      <motion.button whileHover={{ scale: 1.03 }}
        onClick={() => { clearParty(); setPhase('menu'); }}
        style={{
          marginTop: 16, background: 'none', border: 'none', color: '#6b5a8a',
          fontFamily: "'Cinzel', serif", fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.1em',
        }}>
        Back to Menu
      </motion.button>
    </div>
  );
}
