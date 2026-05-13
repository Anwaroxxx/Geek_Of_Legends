import { useEffect, useRef, useCallback } from 'react';

interface GameLoopOptions {
  onTick?: (deltaTime: number) => void;
  fps?: number;
  enabled?: boolean;
}

export const useGameLoop = ({ onTick, fps = 60, enabled = true }: GameLoopOptions = {}) => {
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(0);

  const tick = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (onTick) {
      onTick(deltaTime);
    }

    frameCountRef.current++;
    const now = performance.now();
    if (now - fpsTimeRef.current >= 1000) {
      fpsTimeRef.current = now;
      frameCountRef.current = 0;
    }

    requestRef.current = requestAnimationFrame(tick);
  }, [onTick]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled, tick]);

  return {
    isRunning: enabled,
  targetFps: fps,
  currentFps: frameCountRef.current,
  };
};
