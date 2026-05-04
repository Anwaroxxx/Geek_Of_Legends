# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

### Testing
No test framework is currently configured. When adding tests, set up Vitest or Jest and add test scripts to package.json.

## Project Architecture

This is a 2D game built with React 19, TypeScript, and Vite. The project uses a hybrid rendering approach:

### Rendering Stack
- **Canvas Rendering**: pixi.js (v8.18.1) for high-performance 2D sprite rendering
- **React Integration**: @pixi/react (v8.0.5) to embed Pixi.js canvas in React components
- **Visual Effects**: @pixi/lights, @pixi/particle-emitter, pixi-filters for lighting, particles, and post-processing effects
- **UI Animations**: framer-motion for React-based UI transitions and animations

### Game Systems
- **Physics**: matter-js (v0.20.0) for 2D physics simulation
- **Audio**: howler (v2.2.4) for sound effects and background music
- **Animations**: gsap (v3.15.0) for programmatic animations
- **State Management**: zustand (v5.0.12) for game state
- **Storage**: localforage (v1.10.0) for save/load functionality

### Planned Architecture (from 2D_GAME_PLAN.md)

The project follows a 7-phase development plan with this structure:

**Core Systems** (Phase 1):
- Game loop with `useGameLoop.ts` hook (requestAnimationFrame, delta time, 60 FPS target)
- Game state management with Zustand stores (game, player, enemy, level)
- Input handling (keyboard, mouse, touch) with `useInput.ts` hook

**Rendering** (Phase 2):
- `GameCanvas.tsx` - Canvas component with responsive sizing and high DPI support
- `SpriteRenderer.ts` - Sprite sheet loading, caching, and animation system
- `Background.tsx` - Parallax scrolling backgrounds and tile-based maps

**Game Entities** (Phase 3):
- `Player.tsx` - Player character with physics (acceleration, friction, jump mechanics)
- `Enemy.tsx` - Enemy AI with patrol/chase behaviors
- `Collectible.tsx` - Items, coins, power-ups
- `GameUI.tsx` - HUD with health, score, pause menu, game over screen

**Game Mechanics** (Phase 4):
- `LevelManager.ts` - Level loading, progression, checkpoints
- `CollisionSystem.ts` - AABB collision, tile-based collision, spatial hashing
- `AudioManager.ts` - Sound effects, music, spatial positioning
- `SaveManager.ts` - Local storage, high scores, settings persistence

**Advanced Features** (Phase 5):
- Combat system with hit detection, knockback, invincibility frames
- Dialogue system with `DialogueBox.tsx` and typing effects
- Achievement system with `AchievementManager.ts`
- Minigame framework with `Minigame.tsx`

## Key Implementation Notes

### Pixi.js Integration
The project uses @pixi/react to embed Pixi.js canvases within React components. When working with game rendering:
- Use Pixi.js for sprite rendering, particle effects, and post-processing
- Use React for UI overlays, menus, and game state management
- Coordinate between React state and Pixi.js canvas through the @pixi/react bridge

### State Management Pattern
Zustand stores are organized by domain:
- `gameStore.ts` - Overall game state (menu, playing, paused, game over)
- `playerStore.ts` - Player position, velocity, health, score
- `enemyStore.ts` - Enemy positions, types, behaviors
- `levelStore.ts` - Current level, progress, objectives

### Performance Considerations
The plan includes optimization strategies for Phase 6:
- Object pooling for game entities
- Dirty rectangle rendering for sprites
- Spatial partitioning for large levels
- Spatial hashing for collision detection

### File Structure
The planned structure separates concerns:
- `components/` - React components (GameCanvas, Player, Enemy, UI, etc.)
- `hooks/` - Custom React hooks (useGameLoop, useGameState, useInput, useAudio)
- `systems/` - Game systems (SpriteRenderer, CollisionSystem, LevelManager, etc.)
- `stores/` - Zustand stores
- `types/` - TypeScript type definitions
- `utils/` - Helper functions and constants

## Current State

The project is in early development stage with only two TypeScript files:
- `src/App.tsx`
- `src/main.tsx`

All game assets (sprites, audio, fonts, hero images, monster sprites) are available but not yet integrated.
