// ============================================
// GAME CONSTANTS — Balance, Enums, Colors
// ============================================

export const BASE_STATS = {
  warrior: {
    hp: 400, maxHp: 400,
    mp: 60, maxMp: 60,
    attack: 120, defense: 85,
    speed: 55, critChance: 0.15,
    critMultiplier: 1.8, dodgeChance: 0.05,
    magicResist: 0.2,
  },
  mage: {
    hp: 250, maxHp: 250,
    mp: 200, maxMp: 200,
    attack: 160, defense: 45,
    speed: 70, critChance: 0.20,
    critMultiplier: 2.2, dodgeChance: 0.08,
    magicResist: 0.35,
  },
  archer: {
    hp: 300, maxHp: 300,
    mp: 100, maxMp: 100,
    attack: 140, defense: 60,
    speed: 90, critChance: 0.30,
    critMultiplier: 2.5, dodgeChance: 0.20,
    magicResist: 0.15,
  },
} as const;

export const XP_PER_LEVEL  = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];
export const STAT_POINTS_PER_LEVEL = 5;
export const MAX_LEVEL = 10;

export const BOSS_STATS = {
  sauron: {
    hp: 1200, maxHp: 1200,
    mp: 300, maxMp: 300,
    attack: 90, defense: 50,
    speed: 45, critChance: 0.10,
    critMultiplier: 1.5, dodgeChance: 0.05,
    magicResist: 0.3,
  },
  chronos: {
    hp: 1000, maxHp: 1000,
    mp: 400, maxMp: 400,
    attack: 80, defense: 40,
    speed: 65, critChance: 0.15,
    critMultiplier: 1.5, dodgeChance: 0.10,
    magicResist: 0.45,
  },
  lilith: {
    hp: 900, maxHp: 900,
    mp: 500, maxMp: 500,
    attack: 75, defense: 30,
    speed: 85, critChance: 0.20,
    critMultiplier: 1.5, dodgeChance: 0.20,
    magicResist: 0.55,
  },
} as const;

export const RIDDLE_TRIES_MAX = 3;
export const BOSS_RIDDLE_HP_THRESHOLD = 0.2; // 20% HP triggers riddle

export const RARITY_COLORS: Record<string, string> = {
  common:    '#9ca3af',
  uncommon:  '#4ade80',
  rare:      '#60a5fa',
  epic:      '#c084fc',
  legendary: '#f59e0b',
};

export const STATUS_ICONS: Record<string, string> = {
  burn:    '🔥',
  poison:  '☠️',
  freeze:  '❄️',
  stun:    '⭐',
  charm:   '💜',
  blind:   '👁️',
  bleed:   '🩸',
  shield:  '🛡️',
  berserk: '💢',
  haste:   '⚡',
  slow:    '🐌',
  silence: '🔇',
};

export const SKILL_ICONS: Record<string, string> = {
  slash:         '⚔️',
  shield_wall:   '🛡️',
  titan_cleave:  '💥',
  berserk_mode:  '💢',
  fireball:      '🔥',
  ice_prison:    '❄️',
  arcane_beam:   '⚡',
  meteor:        '☄️',
  piercing_shot: '🏹',
  poison_arrow:  '☠️',
  rain_of_arrows:'🌧️',
  blink:         '💨',
};

export const HERO_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  warrior: { primary: '#ef4444', secondary: '#7f1d1d', glow: 'rgba(239,68,68,0.4)' },
  mage:    { primary: '#8b5cf6', secondary: '#3b0764', glow: 'rgba(139,92,246,0.4)' },
  archer:  { primary: '#10b981', secondary: '#064e3b', glow: 'rgba(16,185,129,0.4)' },
};

export const BOSS_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  sauron:  { primary: '#f97316', secondary: '#7c2d12', glow: 'rgba(249,115,22,0.5)' },
  chronos: { primary: '#38bdf8', secondary: '#0c4a6e', glow: 'rgba(56,189,248,0.5)' },
  lilith:  { primary: '#a855f7', secondary: '#3b0764', glow: 'rgba(168,85,247,0.5)' },
};
