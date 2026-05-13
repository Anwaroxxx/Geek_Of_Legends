import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type VFXType = 'slash' | 'hit' | 'heal' | 'buff' | 'fire' | 'ice' | 'lightning';

interface VFXInstance {
  id: string;
  type: VFXType;
  x: number;
  y: number;
  color?: string;
}

export const useVFX = () => {
  const [effects, setEffects] = useState<VFXInstance[]>([]);

  const spawnVFX = useCallback((type: VFXType, x: number, y: number, color?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setEffects((prev) => [...prev, { id, type, x, y, color }]);
    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== id));
    }, 1000);
  }, []);

  return { effects, spawnVFX };
};

export default function VFXManager({ effects }: { effects: VFXInstance[] }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      <AnimatePresence>
        {effects.map((effect) => (
          <VFXItem key={effect.id} effect={effect} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function VFXItem({ effect }: { effect: VFXInstance }) {
  switch (effect.type) {
    case 'slash':
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5], x: [effect.x - 20, effect.x + 20] }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            left: effect.x,
            top: effect.y,
            width: 100,
            height: 10,
            background: 'white',
            boxShadow: '0 0 20px rgba(255,255,255,0.8)',
            transformOrigin: 'center',
          }}
        />
      );
    case 'hit':
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 2] }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            left: effect.x,
            top: effect.y,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
            boxShadow: '0 0 30px white',
          }}
        />
      );
    case 'fire':
      return <FireParticle x={effect.x} y={effect.y} />;
    default:
      return null;
  }
}

function FireParticle({ x, y }: { x: number, y: number }) {
  const particles = useRef(Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 / 12) * i,
    dist: 20 + Math.random() * 40
  })));

  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ 
            opacity: 0, 
            x: Math.cos(p.angle) * p.dist, 
            y: Math.sin(p.angle) * p.dist - 40,
            scale: 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'orange',
            boxShadow: '0 0 10px red',
          }}
        />
      ))}
    </div>
  );
}
