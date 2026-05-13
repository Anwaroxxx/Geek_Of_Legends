// ============================================
// SPRITE ANIMATOR — CSS spritesheet animation
// ============================================
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { SpriteSheetConfig, SpriteDirection, SpriteAnimation, CharacterSpriteSet } from './SpriteConfig';

interface SpriteAnimatorProps {
  spriteSet: CharacterSpriteSet;
  animation: SpriteAnimation;
  direction: SpriteDirection;
  scale?: number;
  loop?: boolean;
  playing?: boolean;
  onComplete?: () => void;
  style?: React.CSSProperties;
  className?: string;
  tint?: string; // CSS filter for tinting
  flipX?: boolean;
  isHurt?: boolean;
  isAttacking?: boolean;
}

export default function SpriteAnimator({
  spriteSet,
  animation,
  direction,
  scale = 2,
  loop = true,
  playing = true,
  onComplete,
  style,
  className,
  tint,
  flipX = false,
  isHurt = false,
  isAttacking = false,
}: SpriteAnimatorProps) {
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Resolve which config to use for this animation
  const config: SpriteSheetConfig | undefined = (() => {
    switch (animation) {
      case 'idle': return spriteSet.idle;
      case 'walk': return spriteSet.walk || spriteSet.idle;
      case 'attack': return spriteSet.attack;
      case 'cast': return spriteSet.cast || spriteSet.attack;
      case 'shoot': return spriteSet.shoot || spriteSet.attack;
      case 'hurt': return spriteSet.hurt;
      case 'death': return spriteSet.hurt; // reuse hurt
      case 'thrust': return spriteSet.thrust || spriteSet.attack;
      default: return spriteSet.idle;
    }
  })();

  if (!config) return null;

  const row = config.directionRow[direction] ?? config.directionRow.down;

  useEffect(() => {
    if (!playing) {
      setFrame(0);
      return;
    }

    // Hit-stop logic: pause animation briefly if hurt
    if (isHurt && animation !== 'hurt') return;

    const ms = 1000 / config.fps;
    intervalRef.current = window.setInterval(() => {
      setFrame((prev) => {
        const next = prev + 1;
        if (next >= config.frameCount) {
          if (!loop) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            onComplete?.();
            return prev;
          }
          return 0;
        }
        return next;
      });
    }, ms);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, config.fps, config.frameCount, loop, onComplete, isHurt, animation]);

  // Reset frame when animation changes
  useEffect(() => {
    setFrame(0);
  }, [animation, direction]);

  const bgX = -(frame * config.frameWidth);
  const bgY = -(row * config.frameHeight);

  const displayWidth = config.frameWidth * scale;
  const displayHeight = config.frameHeight * scale;

  return (
    <motion.div
      className={className}
      animate={{
        scaleX: isAttacking ? 1.2 : flipX ? -1 : 1,
        scaleY: isHurt ? 0.9 : 1,
        filter: isHurt ? 'brightness(3) saturate(0) contrast(2)' : tint || 'none',
      }}
      transition={{ duration: 0.1 }}
      style={{
        width: displayWidth,
        height: displayHeight,
        backgroundImage: `url(${config.src})`,
        backgroundPosition: `${bgX * scale}px ${bgY * scale}px`,
        backgroundSize: `${config.columns * config.frameWidth * scale}px ${config.rows * config.frameHeight * scale}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
}
