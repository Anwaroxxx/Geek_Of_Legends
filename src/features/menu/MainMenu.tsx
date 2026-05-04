// ============================================
// MAIN MENU — Dark Fantasy Entry Screen
// ============================================
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useHeroStore } from '../../store/heroStore';
import '../../styles/globals.css';
import '../../styles/animations.css';
import '../../styles/theme.css';

export default function MainMenu() {
  const { setPhase, setCurrentBoss, resetDefeatedBosses } = useGameStore();
  const { clearParty, createHero, resetForBattle } = useHeroStore();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSubtitle(true), 800);
    const t2 = setTimeout(() => setShowButtons(true), 1500);

    // Generate floating ember particles
    const parts = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(parts);

    return () => { clearTimeout(t1); clearTimeout(t2);    };
  }, []);

  const handleNewRaid = () => {
    // Reset state for a fresh run
    clearParty();
    resetForBattle();
    resetDefeatedBosses();
    
    // Go to party creation so user can choose their heroes
    setPhase('party-creation');
  };

  // Animated background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark radial gradient bg
      const grd = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.4, 0,
        canvas.width / 2, canvas.height * 0.4, canvas.width * 0.8
      );
      grd.addColorStop(0, 'rgba(26,11,46,0.3)');
      grd.addColorStop(0.5, 'rgba(13,5,24,0.5)');
      grd.addColorStop(1, 'rgba(5,3,10,0.9)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating rune circles
      for (let i = 0; i < 3; i++) {
        const cx = canvas.width * (0.2 + i * 0.3);
        const cy = canvas.height * 0.5 + Math.sin(time + i * 2) * 30;
        const radius = 60 + Math.sin(time * 0.7 + i) * 20;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168,85,247,${0.08 + Math.sin(time + i) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.6, time * 0.3 + i, time * 0.3 + i + Math.PI * 1.5);
        ctx.strokeStyle = `rgba(197,160,89,${0.1 + Math.sin(time * 0.5 + i) * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #05030a 0%, #0a0612 30%, #120a22 60%, #0a0612 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Animated background */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}
      />

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ember particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-5%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(249,115,22,0.9) 0%, rgba(239,68,68,0.4) 100%)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(249,115,22,0.5)`,
            animation: `ember ${p.duration}s ease-out ${p.delay}s infinite`,
            zIndex: 2,
            pointerEvents: 'none',
            '--drift': `${(Math.random() - 0.5) * 60}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: 700 }}>
        {/* Decorative rune circle behind title */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            width: 300,
            height: 300,
            transform: 'translateX(-50%)',
            border: '1px solid rgba(197,160,89,0.15)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{
            position: 'absolute', inset: 20,
            border: '1px solid rgba(168,85,247,0.12)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', inset: 45,
            border: '1px dashed rgba(197,160,89,0.08)',
            borderRadius: '50%',
          }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.17, 0.67, 0.35, 1] }}
          style={{
            fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            color: '#c5a059',
            letterSpacing: '0.06em',
            lineHeight: 1.1,
            textShadow: `
              0 0 20px rgba(197,160,89,0.8),
              0 0 40px rgba(197,160,89,0.4),
              0 0 80px rgba(197,160,89,0.2),
              0 4px 8px rgba(0,0,0,0.8)
            `,
            marginBottom: 8,
          }}
          className="anim-title-glow"
        >
          GEEK OF LEGENDS
        </motion.h1>

        {/* Subtitle */}
        <AnimatePresence>
          {showSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                color: '#8b7aa8',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: 48,
              }}
            >
              Eclipse Raid
            </motion.p>
          )}
        </AnimatePresence>

        {/* Ornamental divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            width: 200,
            height: 1,
            margin: '0 auto 40px',
            background: 'linear-gradient(90deg, transparent, #c5a059, transparent)',
          }}
        />

        {/* Menu buttons */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}
            >
              {/* New Game */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(197,160,89,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNewRaid}
                style={{
                  width: 280,
                  padding: '16px 40px',
                  background: 'linear-gradient(135deg, #7c4f12 0%, #c5a059 50%, #7c4f12 100%)',
                  backgroundSize: '200% 100%',
                  border: 'none',
                  borderRadius: 6,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#0a0800',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(197,160,89,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  animation: 'shimmer 3s linear infinite',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                ⚔️ New Raid
              </motion.button>

              {/* Continue (disabled for now) */}
              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#c5a059' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: 280,
                  padding: '14px 40px',
                  background: 'linear-gradient(135deg, #1a1030 0%, #2d1f56 100%)',
                  border: '1px solid rgba(197,160,89,0.3)',
                  borderRadius: 6,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#8b7aa8',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                }}
                disabled
              >
                📜 Continue
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#5c3d9e' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: 280,
                  padding: '14px 40px',
                  background: 'transparent',
                  border: '1px solid rgba(90,60,150,0.3)',
                  borderRadius: 6,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#6b5a8a',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
                onClick={() => setShowSettings(true)}
              >
                ⚙️ Settings
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          style={{
            marginTop: 60,
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.7rem',
            color: '#4a3d6b',
            letterSpacing: '0.15em',
          }}
        >
          v0.1.0 · EARLY BUILD · © 2024 ECLIPSE STUDIOS
        </motion.p>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                width: 400, padding: 30,
                background: 'linear-gradient(135deg, #120a22 0%, #05030a 100%)',
                border: '1px solid #c5a059', borderRadius: 12,
                boxShadow: '0 0 40px rgba(197,160,89,0.2)',
                textAlign: 'center',
              }}
            >
              <h2 style={{
                fontFamily: "'Cinzel', serif", color: '#c5a059',
                fontSize: '1.5rem', marginBottom: 20, letterSpacing: '0.1em'
              }}>Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 30, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#8b7aa8', fontFamily: "'Cinzel', serif" }}>Master Volume</span>
                  <input type="range" min="0" max="100" defaultValue="100" style={{ width: 150, accentColor: '#c5a059' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#8b7aa8', fontFamily: "'Cinzel', serif" }}>Music Volume</span>
                  <input type="range" min="0" max="100" defaultValue="80" style={{ width: 150, accentColor: '#c5a059' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#8b7aa8', fontFamily: "'Cinzel', serif" }}>SFX Volume</span>
                  <input type="range" min="0" max="100" defaultValue="90" style={{ width: 150, accentColor: '#c5a059' }} />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '10px 30px', background: 'transparent',
                  border: '1px solid #c5a059', borderRadius: 6,
                  color: '#c5a059', fontFamily: "'Cinzel', serif",
                  cursor: 'pointer', letterSpacing: '0.1em'
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
