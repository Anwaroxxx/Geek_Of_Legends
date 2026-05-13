export type HeroClass = 'warrior' | 'mage' | 'archer';
export type BossId    = 'sauron' | 'chronos' | 'lilith';
export type GamePhase = 'menu' | 'party-creation' | 'stat-allocation' | 'battle' | 'riddle' | 'loot' | 'victory' | 'death' | 'grand-victory';
export type BattlePhase = 'wave' | 'elite' | 'boss';
export type Rarity    = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type SkillType = 'damage' | 'heal' | 'buff' | 'debuff' | 'dot' | 'aoe';
export type DamageType= 'physical' | 'magic' | 'fire' | 'ice' | 'lightning' | 'shadow' | 'arcane' | 'true';
export type StatusEffect = 'burn' | 'poison' | 'freeze' | 'stun' | 'charm' | 'blind' | 'bleed' | 'shield' | 'berserk' | 'haste' | 'slow' | 'silence';

export interface StatBlock {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;  // 0-1
  critMultiplier: number; // e.g. 2.0 = 200%
  dodgeChance: number; // 0-1
  magicResist: number; // 0-1
}

export interface StatusEffectInstance {
  type: StatusEffect;
  duration: number;    // turns remaining
  value: number;       // damage per turn or strength modifier
  stacks: number;
  sourceId: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  damageType: DamageType;
  baseDamage: number;
  mpCost: number;
  rageCost?: number;
  arrowCost?: number;
  cooldown: number;
  currentCooldown: number;
  targetAll: boolean;
  statusEffect?: StatusEffect;
  statusDuration?: number;
  statusValue?: number;
  icon: string;   // emoji or asset path
  vfx: string;    // VFX key
}

export interface HeroData {
  id: string;
  name: string;
  heroClass: HeroClass;
  level: number;
  xp: number;
  xpToNext: number;
  stats: StatBlock;
  skills: Skill[];
  statusEffects: StatusEffectInstance[];
  rage?: number;
  maxRage?: number;
  arrows?: number;
  maxArrows?: number;
  portrait: string;
  isAlive: boolean;
  relics: string[];
}

export interface BossPhase {
  id: number;
  name: string;
  hpThreshold: number; // 0-1, triggers when hp % falls below
  specialAttack: string;
  aura?: string;
  enrageMultiplier?: number;
}

export interface BossData {
  id: BossId;
  name: string;
  title: string;
  stats: StatBlock;
  skills: Skill[];
  statusEffects: StatusEffectInstance[];
  phases: BossPhase[];
  currentPhase: number;
  portrait: string;
  arena: string;
  isAlive: boolean;
  riddleTriggered: boolean;
}

export interface CombatLog {
  id: string;
  turn: number;
  message: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'miss' | 'crit' | 'death' | 'phase' | 'system';
  value?: number;
}

export interface FloatingText {
  id: string;
  text: string;
  type: 'normal' | 'crit' | 'heal' | 'poison' | 'miss' | 'system';
  x: number;
  y: number;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  effect: string;
  icon: string;
  passive: boolean;
}

export interface LootDrop {
  relics: Relic[];
  gold: number;
  xp: number;
}

export interface RiddleQuestion {
  id: string;
  type: 'logic' | 'code' | 'memory' | 'typing' | 'clone';
  prompt: string;
  answer: string;
  options?: string[];        // for multiple choice
  sequence?: string[];       // for memory
  timeLimit?: number;        // seconds
  hint?: string;
}
