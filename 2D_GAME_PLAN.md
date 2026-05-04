# GeekOfLegend 2D Game Development Plan

## Project Overview
- **Framework**: Vite + React 19 + TypeScript
- **Build Tool**: Vite (HMR enabled)
- **Styling**: CSS with CSS variables (Tailwind available)
- **State Management**: Zustand (already installed)
- **Animation**: Framer Motion (already installed)
- **Game Assets**: Sprites, audio, fonts, hero images, monster sprites

---

## Phase 1: Game Architecture & Core Systems

### 1.1 Game Loop Implementation
- Create `useGameLoop.ts` hook for requestAnimationFrame loop
- Implement delta time calculation for smooth movement
- Set up game tick rate (60 FPS target)
- Handle pause/resume functionality

### 1.2 Game State Management
- Define game state interfaces:
  - `GameState` - overall game state (menu, playing, paused, game over)
  - `PlayerState` - player position, velocity, health, score
  - `EnemyState` - enemy positions, types, behaviors
  - `LevelState` - current level, progress, objectives
- Set up Zustand store with game slices
- Implement game actions (move, jump, attack, pause, restart)

### 1.3 Input Handling
- Keyboard input (WASD or arrow keys)
- Mouse input (click, drag, hover)
- Touch input (for mobile support)
- Input state management with key bindings
- Input debouncing for game controls

---

## Phase 2: Rendering System

### 2.1 Canvas Setup
- Create `GameCanvas.tsx` component
- Set up canvas context and sizing
- Implement responsive canvas (resize handling)
- Set up high DPI support for crisp rendering

### 2.2 Sprite Rendering System
- Create `SpriteRenderer.ts` utility
- Implement sprite sheet loading and caching
- Create sprite animation system
- Implement sprite flipping for character direction
- Create particle system for effects

### 2.3 Background & Environment
- Create `Background.tsx` component
- Implement parallax scrolling backgrounds
- Create tile-based map rendering
- Implement lighting and shadow effects
- Create weather/atmosphere effects

---

## Phase 3: Game Entities

### 3.1 Player Character
- Create `Player.tsx` component
- Implement player movement physics (acceleration, friction, max speed)
- Implement jump mechanics (gravity, double jump, coyote time)
- Implement player animation states (idle, run, jump, attack, hurt)
- Implement collision detection with world

### 3.2 Enemies & NPCs
- Create `Enemy.tsx` component
- Implement enemy AI behaviors (patrol, chase, attack patterns)
- Create enemy types (magicien_monster_1, monster-1, monster-2)
- Implement enemy spawning system
- Create boss battle mechanics

### 3.3 Collectibles & Power-ups
- Create `Collectible.tsx` component
- Implement coin/item collection
- Create power-up system (speed boost, invincibility, extra life)
- Create score and high score tracking

### 3.4 UI & HUD
- Create `GameUI.tsx` component
- Implement health bar display
- Create score display
- Create level progress indicator
- Create pause menu and game over screen
- Create settings screen

---

## Phase 4: Game Mechanics

### 4.1 Level System
- Create `LevelManager.ts` utility
- Implement level data structure
- Create level loading system
- Implement level progression and unlocking
- Create checkpoint system

### 4.2 Collision Detection
- Create `CollisionSystem.ts` utility
- Implement AABB collision detection
- Implement tile-based collision
- Implement player-enemy collision
- Implement player-collectible collision

### 4.3 Audio System
- Create `AudioManager.ts` utility
- Implement sound effect loading
- Implement background music and sound effects
- Create audio spatial positioning (optional)
- Implement audio ducking for dialogue

### 4.4 Save/Load System
- Create `SaveManager.ts` utility
- Implement local storage saving
- Implement level progress saving
- Implement high score tracking
- Create settings persistence

---

## Phase 5: Game Features

### 5.1 Combat System
- Implement attack mechanics (hit detection, damage calculation)
- Create knockback and stun effects
- Implement invincibility frames
- Create death and respawn mechanics

### 5.2 Dialogue System
- Create `DialogueBox.tsx` component
- Implement NPC dialogue system
- Create dialogue typing effect
- Implement dialogue choice system

### 5.3 Achievement System
- Create `AchievementManager.ts` utility
- Implement achievement tracking
- Create achievement unlock notifications
- Create achievement display screen

### 5.4 Minigames
- Create `Minigame.tsx` component
- Implement time-based challenges
- Create score-based challenges
- Create collectible challenges

---

## Phase 6: Performance & Polish

### 6.1 Performance Optimization
- Implement object pooling for game entities
- Optimize sprite rendering with dirty rectangles
- Implement spatial partitioning for large levels
- Optimize collision detection with spatial hashing

### 6.2 Visual Effects
- Create particle system for explosions, magic, etc.
- Implement screen shake and camera effects
- Create lighting and shadow effects
- Implement weather and atmosphere effects

### 6.3 Accessibility
- Implement keyboard navigation
- Implement screen reader support
- Implement high contrast mode
- Implement colorblind mode options

### 6.4 Mobile Support
- Implement touch controls
- Implement responsive layout
- Implement device orientation handling
- Implement performance scaling

---

## Phase 7: Testing & Debugging

### 7.1 Unit Testing
- Set up testing framework (Jest, Vitest, or React Testing Library)
- Write tests for game logic
- Write tests for collision detection
- Write tests for state management

### 7.2 Integration Testing
- Test game loop functionality
- Test input handling
- Test save/load system

### 7.3 Debugging Tools
- Create debug overlay component
- Implement frame rate display
- Implement collision visualization
- Implement state inspector

---

## File Structure

```
src/
├── components/
│   ├── GameCanvas.tsx
│   ├── Player.tsx
│   ├── Enemy.tsx
│   ├── Collectible.tsx
│   ├── GameUI.tsx
│   ├── DialogueBox.tsx
│   ├── Background.tsx
│   └── Minigame.tsx
├── hooks/
│   ├── useGameLoop.ts
│   ├── useGameState.ts
│   ├── useInput.ts
│   └── useAudio.ts
├── systems/
│   ├── SpriteRenderer.ts
│   ├── CollisionSystem.ts
│   ├── LevelManager.ts
│   ├── SaveManager.ts
│   ├── AudioManager.ts
│   └── ParticleSystem.ts
├── stores/
│   ├── gameStore.ts
│   ├── playerStore.ts
│   ├── enemyStore.ts
│   └── levelStore.ts
├── types/
│   ├── game.ts
│   ├── player.ts
│   ├── enemy.ts
│   ├── level.ts
│   └── ui.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
└── main.tsx
```

---

## Technology Stack

- **Core**: React 19, TypeScript, Vite
- **State**: Zustand (already installed)
- **Animation**: Framer Motion (already installed)
- **Styling**: CSS + Tailwind CSS (already installed)
- **Build**: Vite with HMR
- **Testing**: Jest/Vitest (to be added)
- **Linting**: ESLint + TypeScript ESLint (already configured)

---

## Next Steps

1. **Review and enhance this plan** - Add your game-specific requirements
2. **Prioritize phases** - Which features are essential vs. nice-to-have?
3. **Start implementation** - Begin with Phase 1 (Core Systems)
4. **Iterate and test** - Build incrementally with frequent testing

---

## Questions for Enhancement

1. **What type of 2D game?** (platformer, RPG, action, puzzle, etc.)
2. **What are the core mechanics?** (movement, combat, puzzle-solving, etc.)
3. **What's the target platform?** (web, desktop, mobile, or all)
4. **What's the art style?** (pixel art, vector art, hand-drawn, etc.)
5. **What's the scope?** (single level, multiple levels, endless runner, etc.)
6. **Any specific features?** (multiplayer, achievements, leaderboards, etc.)

---

## Notes

- The project already has game assets (sprites, audio, fonts, hero images, monster sprites)
- Use existing CSS variables for theming consistency
- Leverage Zustand for state management
- Use Framer Motion for smooth animations
- Consider using PixiJS for sprite rendering if needed
- Use Vite's HMR for fast development iteration
- Implement responsive design for mobile support
- Consider using Web Audio API for sound effects
- Use TypeScript for type safety throughout
- Follow React best practices for component design
- Implement proper error handling and edge cases
