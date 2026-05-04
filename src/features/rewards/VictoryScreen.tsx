// ============================================
// VICTORY SCREEN
// ============================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useHeroStore } from '../../store/heroStore';
import { useBattleStore } from '../../store/battleStore';

const LOOT_TABLE = [
  { name: 'Phoenix Heart', rarity: 'legendary', icon: '❤️‍🔥', desc: 'Revive once per battle' },
  { name: 'Crown of Time', rarity: 'epic', icon: '👑', desc: '+15% Speed' },
  { name: 'Inferno Blade', rarity: 'rare', icon: '🗡️', desc: '+20% Attack' },
  { name: 'Arcane Tome', rarity: 'epic', icon: '📕', desc: '+25% Magic' },
  { name: 'Shadow Cloak', rarity: 'rare', icon: '🧥', desc: '+15% Dodge' },
  { name: 'Thunder Gem', rarity: 'rare', icon: '💎', desc: 'Chain lightning 10%' },
];

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af', uncommon: '#4ade80', rare: '#60a5fa', epic: '#c084fc', legendary: '#f59e0b',
};

export default function VictoryScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const { addGold, incrementRuns } = useGameStore();
  const addXp = useHeroStore((s) => s.addXp);
  const heroes = useHeroStore((s) => s.heroes);
  const boss = useBattleStore((s) => s.boss);
  const resetBattle = useBattleStore((s) => s.resetBattle);
  const [revealStep, setRevealStep] = useState(0);
  const [loot] = useState(() => [...LOOT_TABLE].sort(() => Math.random() - 0.5).slice(0, 2));
  const [goldReward] = useState(() => 150 + Math.floor(Math.random() * 200));
  const [xpReward] = useState(() => 80 + Math.floor(Math.random() * 120));

  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStep(1), 500),
      setTimeout(() => setRevealStep(2), 1200),
      setTimeout(() => setRevealStep(3), 2000),
    ];
    addGold(goldReward);
    heroes.forEach((h) => addXp(h.id, xpReward));
    incrementRuns();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #05030a 0%, #0d1a0a 50%, #05030a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,160,89,0.1) 0%, transparent 70%)',
        top: '30%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: 30, zIndex: 2 }}>
        <h1 style={{
          fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900, color: '#c5a059',
          textShadow: '0 0 30px rgba(197,160,89,0.8), 0 0 60px rgba(197,160,89,0.4)',
        }}>⚔️ Victory! ⚔️</h1>
        {boss && <p style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#8b7aa8', marginTop: 8 }}>
          {boss.name}, {boss.title} has been vanquished!</p>}
      </motion.div>

      {revealStep >= 1 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', gap: 24, marginBottom: 24, zIndex: 2 }}>
          <div style={{ padding: '12px 24px', background: 'rgba(13,10,24,0.9)', border: '1px solid rgba(197,160,89,0.3)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem' }}>💰</p>
            <p style={{ fontFamily: "'Cinzel', serif", color: '#c5a059', fontSize: '1.2rem', fontWeight: 700 }}>{goldReward}</p>
            <p style={{ fontSize: '0.65rem', color: '#8b7aa8' }}>Gold</p>
          </div>
          <div style={{ padding: '12px 24px', background: 'rgba(13,10,24,0.9)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem' }}>✨</p>
            <p style={{ fontFamily: "'Cinzel', serif", color: '#a855f7', fontSize: '1.2rem', fontWeight: 700 }}>{xpReward}</p>
            <p style={{ fontSize: '0.65rem', color: '#8b7aa8' }}>XP Each</p>
          </div>
        </motion.div>
      )}

      {revealStep >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500, marginBottom: 30, zIndex: 2 }}>
          {loot.map((item, i) => (
            <motion.div key={item.name} initial={{ opacity: 0, scale: 0.7, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: i * 0.3 }}
              style={{ width: 150, padding: 14, background: '#120e22', border: `1px solid ${RARITY_COLORS[item.rarity]}44`,
                borderRadius: 10, textAlign: 'center', boxShadow: `0 0 15px ${RARITY_COLORS[item.rarity]}22` }}>
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>{item.icon}</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '0.75rem', color: RARITY_COLORS[item.rarity] }}>{item.name}</p>
              <p style={{ fontSize: '0.55rem', color: RARITY_COLORS[item.rarity], textTransform: 'uppercase' }}>{item.rarity}</p>
              <p style={{ fontSize: '0.6rem', color: '#8b7aa8' }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {revealStep >= 3 && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(197,160,89,0.5)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { resetBattle(); setPhase('menu'); }}
          style={{
            padding: '14px 50px', background: 'linear-gradient(135deg, #7c4f12 0%, #c5a059 50%, #7c4f12 100%)',
            backgroundSize: '200% 100%', border: 'none', borderRadius: 6,
            fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: 700,
            color: '#0a0800', letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', animation: 'shimmer 3s linear infinite',
            boxShadow: '0 0 25px rgba(197,160,89,0.3)', zIndex: 2,
          }}>Return to Menu</motion.button>
      )}
    </div>
  );
}
