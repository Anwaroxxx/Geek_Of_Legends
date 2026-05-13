import { useEffect, useRef, useCallback } from 'react';

interface InputOptions {
  enabled?: boolean;
}

export const useInput = ({ enabled = true }: InputOptions = {}) => {
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, isRightDown: false, isMiddleDown: false });
  const touchRef = useRef({ x: 0, y: 0, isDown: false });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    keysRef.current.add(event.key.toLowerCase());
  }, [enabled]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    keysRef.current.delete(event.key.toLowerCase());
  }, [enabled]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!enabled) return;

    mouseRef.current.isDown = true;
    mouseRef.current.isRightDown = event.button === 2;
    mouseRef.current.isMiddleDown = event.button === 1;
    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  }, [enabled]);

  const handleMouseUp = useCallback(() => {
    if (!enabled) return;

    mouseRef.current.isDown = false;
    mouseRef.current.isRightDown = false;
    mouseRef.current.isMiddleDown = false;
  }, [enabled]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabled) return;

    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  }, [enabled]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    const touch = event.touches[0];
    touchRef.current.isDown = true;
    touchRef.current.x = touch.clientX;
    touchRef.current.y = touch.clientY;
  }, [enabled]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled) return;

    touchRef.current.isDown = false;
  }, [enabled]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    const touch = event.touches[0];
    touchRef.current.x = touch.clientX;
    touchRef.current.y = touch.clientY;
  }, [enabled]);

  const isKeyPressed = useCallback((key: string) => {
    return keysRef.current.has(key.toLowerCase());
  }, []);

  const getMousePosition = useCallback(() => {
    return { x: mouseRef.current.x, y: mouseRef.current.y };
  }, []);

  const getTouchPosition = useCallback(() => {
    return { x: touchRef.current.x, y: touchRef.current.y };
  }, []);

  const clearInput = useCallback(() => {
    keysRef.current.clear();
    mouseRef.current.isDown = false;
    mouseRef.current.isRightDown = false;
    mouseRef.current.isMiddleDown = false;
    touchRef.current.isDown = false;
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled, handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove, handleTouchStart, handleTouchEnd, handleTouchMove]);

  return {
    isKeyPressed,
    getMousePosition,
    getTouchPosition,
    clearInput,
  };
};
