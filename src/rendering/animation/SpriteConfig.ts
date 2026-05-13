// ============================================
// SPRITE CONFIG — Frame data for all spritesheets
// ============================================

export interface SpriteSheetConfig {
  src: string;           // import path
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  /** Which row index (0-based) to use for each direction. Default: down=0, left=1, right=2, up=3 */
  directionRow: {
    down: number;
    left: number;
    right: number;
    up: number;
  };
  frameCount: number;    // frames per direction
  fps: number;
}

export interface CharacterSpriteSet {
  idle: SpriteSheetConfig;
  walk?: SpriteSheetConfig;
  attack: SpriteSheetConfig;    // slash or main attack
  cast?: SpriteSheetConfig;
  shoot?: SpriteSheetConfig;
  hurt: SpriteSheetConfig;
  death?: SpriteSheetConfig;    // can reuse hurt
  thrust?: SpriteSheetConfig;
}

// ─── HERO (Warrior / default hero) ───
// idle: 384x768 → 2 cols, 4 rows, frame=192x192
// slash: 960x768 → 5 cols, 4 rows, frame=192x192
// cast: 384x256 → 6 cols, 4 rows, frame=64x64
// hurt: 960x192 → 5 cols, 1 row, frame=192x192
// walk: 1536x768 → 8 cols, 4 rows, frame=192x192
// shoot: 768x256 → 12 cols, 4 rows, frame=64x64
// thrust: 448x256 → 7 cols, 4 rows, frame=64x64

export const HERO_SPRITES: CharacterSpriteSet = {
  idle: {
    src: '/assets/hero/hero_idle.png',
    frameWidth: 192, frameHeight: 192,
    columns: 2, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 2, fps: 3,
  },
  walk: {
    src: '/assets/hero/hero_walk.png',
    frameWidth: 192, frameHeight: 192,
    columns: 8, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 8, fps: 8,
  },
  attack: {
    src: '/assets/hero/hero_slash.png',
    frameWidth: 192, frameHeight: 192,
    columns: 5, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 5, fps: 10,
  },
  cast: {
    src: '/assets/hero/hero_cast.png',
    frameWidth: 64, frameHeight: 64,
    columns: 6, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 6, fps: 8,
  },
  shoot: {
    src: '/assets/hero/hero_shoot.png',
    frameWidth: 64, frameHeight: 64,
    columns: 12, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 12, fps: 10,
  },
  hurt: {
    src: '/assets/hero/hero_hurt.png',
    frameWidth: 192, frameHeight: 192,
    columns: 5, rows: 1,
    directionRow: { up: 0, left: 0, down: 0, right: 0 },
    frameCount: 5, fps: 6,
  },
  thrust: {
    src: '/assets/hero/hero_thrust.png',
    frameWidth: 64, frameHeight: 64,
    columns: 7, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 7, fps: 10,
  },
};

// ─── MAGE HERO ───
export const MAGE_SPRITES: CharacterSpriteSet = {
  idle: {
    src: '/assets/mage-hero/mage-hero_idle.png',
    frameWidth: 192, frameHeight: 192,
    columns: 2, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 2, fps: 3,
  },
  walk: {
    src: '/assets/mage-hero/mage-hero_walk.png',
    frameWidth: 192, frameHeight: 192,
    columns: 8, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 8, fps: 8,
  },
  attack: {
    src: '/assets/mage-hero/mage-hero_slash.png',
    frameWidth: 192, frameHeight: 192,
    columns: 5, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 5, fps: 10,
  },
  cast: {
    src: '/assets/mage-hero/mage-hero_cast.png',
    frameWidth: 192, frameHeight: 192,
    columns: 6, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 6, fps: 8,
  },
  shoot: {
    src: '/assets/mage-hero/mage-hero_shoot.png',
    frameWidth: 192, frameHeight: 192,
    columns: 12, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 12, fps: 10,
  },
  hurt: {
    src: '/assets/mage-hero/mage-hero_hurt.png',
    frameWidth: 192, frameHeight: 192,
    columns: 5, rows: 1,
    directionRow: { up: 0, left: 0, down: 0, right: 0 },
    frameCount: 5, fps: 6,
  },
};

// ─── ARCHER HERO (Universal LPC) ───
export const ARCHER_SPRITES: CharacterSpriteSet = {
  idle: {
    src: '/assets/archer-hero/archer-hero_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    directionRow: { up: 10, left: 9, down: 8, right: 11 },
    frameCount: 1, fps: 2,
  },
  walk: {
    src: '/assets/archer-hero/archer-hero_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    directionRow: { up: 10, left: 9, down: 8, right: 11 },
    frameCount: 9, fps: 8,
  },
  attack: {
    src: '/assets/archer-hero/archer-hero_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    // bow shoot rows: up=16, left=17, down=18, right=19
    directionRow: { up: 16, left: 17, down: 18, right: 19 },
    frameCount: 13, fps: 12,
  },
  shoot: {
    src: '/assets/archer-hero/archer-hero_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    directionRow: { up: 16, left: 17, down: 18, right: 19 },
    frameCount: 13, fps: 12,
  },
  hurt: {
    src: '/assets/archer-hero/archer-hero_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    directionRow: { up: 20, left: 20, down: 20, right: 20 },
    frameCount: 6, fps: 6,
  },
};

// ─── MAGICIEN MONSTER 1 (Boss Lilith / Mage visual) ───
// idle: 128x256 → 2 cols, 4 rows, frame=64x64
// cast: 384x256 → 6 cols, 4 rows, frame=64x64
// slash: 320x256 → 5 cols, 4 rows, frame=64x64
// hurt: 320x64 → 5 cols, 1 row, frame=64x64
// walk: 512x256 → 8 cols, 4 rows, frame=64x64
// shoot: 768x256 → 12 cols, 4 rows, frame=64x64

export const MAGICIEN_SPRITES: CharacterSpriteSet = {
  idle: {
    src: '/assets/magicien_monster_1/magicien_monster_1_idle.png',
    frameWidth: 64, frameHeight: 64,
    columns: 2, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 2, fps: 3,
  },
  walk: {
    src: '/assets/magicien_monster_1/magicien_monster_1_walk.png',
    frameWidth: 64, frameHeight: 64,
    columns: 8, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 8, fps: 8,
  },
  attack: {
    src: '/assets/magicien_monster_1/magicien_monster_1_slash.png',
    frameWidth: 64, frameHeight: 64,
    columns: 5, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 5, fps: 10,
  },
  cast: {
    src: '/assets/magicien_monster_1/magicien_monster_1_cast.png',
    frameWidth: 64, frameHeight: 64,
    columns: 6, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 6, fps: 8,
  },
  shoot: {
    src: '/assets/magicien_monster_1/magicien_monster_1_shoot.png',
    frameWidth: 64, frameHeight: 64,
    columns: 12, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 12, fps: 10,
  },
  hurt: {
    src: '/assets/magicien_monster_1/magicien_monster_1_hurt.png',
    frameWidth: 64, frameHeight: 64,
    columns: 5, rows: 1,
    directionRow: { up: 0, left: 0, down: 0, right: 0 },
    frameCount: 5, fps: 6,
  },
};

// ─── MONSTER 2 (Boss Sauron) ───
// idle: 128x256 → 2 cols, 4 rows, frame=64x64
// slash: 960x768 → BUT this monster might have bigger frames
// For monster-2, looking at the image it appeared 64x64 grid-ish
// cast: 384x256 → 6 cols, 4 rows, frame=64x64
// hurt: 320x64 → 5 cols, 1 row, frame=64x64
// walk: 512x256 → 8 cols, 4 rows, frame=64x64

export const MONSTER2_SPRITES: CharacterSpriteSet = {
  idle: {
    src: '/assets/monster-2/monster-2_idle.png',
    frameWidth: 64, frameHeight: 64,
    columns: 2, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 2, fps: 3,
  },
  walk: {
    src: '/assets/monster-2/monster-2_walk.png',
    frameWidth: 64, frameHeight: 64,
    columns: 8, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 8, fps: 8,
  },
  attack: {
    src: '/assets/monster-2/monster-2_slash.png',
    frameWidth: 192, frameHeight: 192,
    columns: 5, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 5, fps: 10,
  },
  cast: {
    src: '/assets/monster-2/monster-2_cast.png',
    frameWidth: 64, frameHeight: 64,
    columns: 6, rows: 4,
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 6, fps: 8,
  },
  hurt: {
    src: '/assets/monster-2/monster-2_hurt.png',
    frameWidth: 64, frameHeight: 64,
    columns: 5, rows: 1,
    directionRow: { up: 0, left: 0, down: 0, right: 0 },
    frameCount: 5, fps: 6,
  },
};

// ─── MONSTER 1 (Boss Chronos — universal sheet) ───
// universal: 832x1344 — This is a full universal LPC sheet
// Standard LPC universal: 64x64 frames, 13 cols, 21 rows
export const MONSTER1_SPRITES: CharacterSpriteSet = {
  idle: {
    src: '/assets/monster-1/monster-1_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    // In universal LPC: row 0 = spellcast up, rows 8-9 = walk, etc.
    // idle is typically the first frame of walk rows
    // walk down = row 8, walk left = row 9, walk right = row 11, walk up = row 10
    directionRow: { up: 10, left: 9, down: 8, right: 11 },
    frameCount: 1, fps: 2,
  },
  walk: {
    src: '/assets/monster-1/monster-1_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    directionRow: { up: 10, left: 9, down: 8, right: 11 },
    frameCount: 9, fps: 8,
  },
  attack: {
    src: '/assets/monster-1/monster-1_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    // slash rows: down=12, left=13, right=15, up=14
    directionRow: { up: 14, left: 13, down: 12, right: 15 },
    frameCount: 6, fps: 10,
  },
  cast: {
    src: '/assets/monster-1/monster-1_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    // spellcast: up=0, left=1, down=2, right=3
    directionRow: { up: 0, left: 1, down: 2, right: 3 },
    frameCount: 7, fps: 8,
  },
  hurt: {
    src: '/assets/monster-1/monster-1_universal.png',
    frameWidth: 64, frameHeight: 64,
    columns: 13, rows: 21,
    // hurt/death row = 20
    directionRow: { up: 20, left: 20, down: 20, right: 20 },
    frameCount: 6, fps: 6,
  },
};

// ─── Character to sprite mapping ───
export type SpriteDirection = 'up' | 'down' | 'left' | 'right';
export type SpriteAnimation = 'idle' | 'walk' | 'attack' | 'cast' | 'shoot' | 'hurt' | 'death' | 'thrust';

export const CHARACTER_SPRITES: Record<string, CharacterSpriteSet> = {
  // Heroes
  warrior: HERO_SPRITES,
  mage: MAGE_SPRITES,
  archer: ARCHER_SPRITES,

  // Bosses
  sauron: MONSTER2_SPRITES,
  chronos: MONSTER1_SPRITES,
  lilith: MAGICIEN_SPRITES,
};
