// ============================================
// GRAND VICTORY — Final celebration for clearing all bosses
// ============================================
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useHeroStore } from '../../store/heroStore';
import SpriteAnimator from '../../rendering/animation/SpriteAnimator';
import { CHARACTER_SPRITES } from '../../rendering/animation/SpriteConfig';
import type { SpriteAnimation } from '../../rendering/animation/SpriteConfig';

export default function GrandVictory() {
  const { setPhase, resetGame } = useGameStore();
  const heroes = useHeroStore((s) => s.heroes);
  const [showContent, setShowContent] = useState(false);
  const [stage, setStage] = useState<'intro' | 'zoom' | 'congrats'>('intro');
  const [heroAnims, setHeroAnims] = useState<Record<string, SpriteAnimation>>({});

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 500);
    const t2 = setTimeout(() => setStage('zoom'), 2500);
    const t3 = setTimeout(() => setStage('congrats'), 5000);

    // Set all heroes to 'idle' initially
    const initialAnims: Record<string, SpriteAnimation> = {};
    heroes.forEach(h => initialAnims[h.id] = 'idle');
    setHeroAnims(initialAnims);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [heroes]);

  // Cycle animations for celebration
  useEffect(() => {
    if (stage === 'intro') return;

    const interval = setInterval(() => {
      const anims = ['attack', 'cast', 'shoot', 'walk', 'idle'] as SpriteAnimation[];
      const nextAnims: Record<string, SpriteAnimation> = {};
      heroes.forEach(h => {
        nextAnims[h.id] = anims[Math.floor(Math.random() * anims.length)];
      });
      setHeroAnims(nextAnims);
    }, 1500);

    return () => clearInterval(interval);
  }, [stage, heroes]);

  const handleReturnToMenu = () => {
    resetGame();
    setPhase('menu');
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(circle at center, #1a0b2e 0%, #05030a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Background visual effects */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
        opacity: 0.1, pointerEvents: 'none',
      }} />

      {/* Floating particles/confetti */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -20, 
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: window.innerHeight + 20,
            rotate: 360,
          }}
          transition={{ 
            duration: 3 + Math.random() * 5, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            position: 'absolute',
            width: 10, height: 10,
            backgroundColor: ['#c5a059', '#8b7aa8', '#a855f7', '#facc15'][Math.floor(Math.random() * 4)],
            borderRadius: '2px',
            zIndex: 1,
          }}
        />
      ))}

      <AnimatePresence>
        {showContent && (
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: 'spring' }}
              style={{ marginBottom: 40 }}
            >
              <h1 style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                color: '#c5a059',
                textShadow: '0 0 30px rgba(197,160,89,0.8), 0 0 60px rgba(197,160,89,0.4)',
                margin: 0,
              }}>ALL BOSSES SLAIN</h1>
              <p style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.2rem',
                color: '#8b7aa8',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginTop: 10,
              }}>The Eclipse Raid is Conquered</p>
            </motion.div>

            {/* Heroes Celebration Section */}
            <motion.div
              animate={{
                scale: stage === 'zoom' ? 1.5 : stage === 'congrats' ? 1.2 : 1,
                y: stage === 'zoom' ? -50 : 0,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{
                display: 'flex', gap: 60, justifyContent: 'center', alignItems: 'flex-end',
                padding: '40px',
              }}
            >
              {heroes.map((hero, i) => {
                const spriteSet = CHARACTER_SPRITES[hero.heroClass];
                const anim = heroAnims[hero.id] || 'idle';
                
                return (
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.3 }}
                    style={{ position: 'relative', textAlign: 'center' }}
                  >
                    {/* Hero Glow */}
                    <motion.div
                      animate={{ 
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: 'absolute', bottom: 0, left: '50%',
                        transform: 'translateX(-50%)',
                        width: 100, height: 40,
                        background: 'radial-gradient(ellipse, #c5a059 0%, transparent 70%)',
                        zIndex: -1,
                      }}
                    />

                    {spriteSet && (
                      <SpriteAnimator
                        spriteSet={spriteSet}
                        animation={anim}
                        direction="right"
                        scale={2}
                        playing={true}
                        style={{ filter: 'drop-shadow(0 10px 20px rgba(197,160,89,0.4))' }}
                      />
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 + i * 0.2 }}
                      style={{
                        marginTop: 10,
                        fontFamily: "'Cinzel', serif",
                        color: '#c5a059',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px black',
                      }}
                    >
                      {hero.name}
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Final Message & Button */}
            <AnimatePresence>
              {stage === 'congrats' && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: 60 }}
                >
                  <h2 style={{
                    fontFamily: "'Cinzel', serif",
                    color: '#e2d9f3',
                    fontSize: '1.5rem',
                    marginBottom: 30,
                    maxWidth: 600,
                    margin: '0 auto 30px',
                  }}>
                    Congratulations, Legend! You have cleansed the realm of its darkest threats.
                  </h2>

                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(197,160,89,0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReturnToMenu}
                    style={{
                      padding: '16px 48px',
                      background: 'linear-gradient(135deg, #c5a059 0%, #7c4f12 100%)',
                      border: 'none',
                      borderRadius: 8,
                      fontFamily: "'Cinzel', serif",
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#05030a',
                      cursor: 'pointer',
                      letterSpacing: '0.1em',
                    }}
                  >
                    RETURN TO HALL OF FAME
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
