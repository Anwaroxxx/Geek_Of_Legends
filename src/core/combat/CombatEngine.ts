
import type { HeroData, BossData, Skill, StatusEffectInstance, FloatingText } from '../../types/Game';

export function calculateDamage(
  baseDamage: number,
  attackerAttack: number,
  defenderDefense: number,
  defenderResist: number,
  isMagic: boolean,
  berserkBonus: number = 0,
): number {
  const scaledBase = baseDamage + attackerAttack * 0.5 + berserkBonus;
  const reduction = isMagic
    ? 1 - defenderResist
    : 1 - (defenderDefense / (defenderDefense + 100));
  return Math.max(1, Math.floor(scaledBase * reduction));
}

/**
 * Roll for critical hit
 */
export function rollCrit(critChance: number): boolean {
  return Math.random() < critChance;
}

/**
 * Roll for dodge
 */
export function rollDodge(dodgeChance: number): boolean {
  return Math.random() < dodgeChance;
}

/**
 * Apply crit multiplier
 */
export function applyCrit(damage: number, multiplier: number): number {
  return Math.floor(damage * multiplier);
}

/**
 * Get berserk bonus from status effects
 */
export function getBerserkBonus(effects: StatusEffectInstance[]): number {
  const berserk = effects.find((e) => e.type === 'berserk');
  return berserk ? berserk.value : 0;
}

/**
 * Check if entity is stunned/frozen/charmed
 */
export function isIncapacitated(effects: StatusEffectInstance[]): boolean {
  return effects.some((e) => e.type === 'stun' || e.type === 'freeze' || e.type === 'charm');
}

/**
 * Process DOT effects (burn, poison, bleed)
 */
export function processDotEffects(effects: StatusEffectInstance[]): number {
  return effects
    .filter((e) => e.type === 'burn' || e.type === 'poison' || e.type === 'bleed')
    .reduce((total, e) => total + e.value * e.stacks, 0);
}

/**
 * Tick all status effect durations down
 */
export function tickStatusEffects(effects: StatusEffectInstance[]): StatusEffectInstance[] {
  return effects
    .map((e) => ({ ...e, duration: e.duration - 1 }))
    .filter((e) => e.duration > 0);
}

/**
 * Add or stack a status effect
 */
export function addStatusEffect(
  current: StatusEffectInstance[],
  type: StatusEffectInstance['type'],
  duration: number,
  value: number,
  sourceId: string,
): StatusEffectInstance[] {
  const existing = current.find((e) => e.type === type);
  if (existing) {
    return current.map((e) =>
      e.type === type
        ? { ...e, duration: Math.max(e.duration, duration), stacks: e.stacks + 1, value }
        : e
    );
  }
  return [...current, { type, duration, value, stacks: 1, sourceId }];
}

/**
 * Resolve a hero attacking the boss
 */
export function resolveHeroAttack(
  hero: HeroData,
  boss: BossData,
  skill: Skill,
): {
  damage: number;
  isCrit: boolean;
  isDodged: boolean;
  statusApplied: boolean;
  floatingText: Omit<FloatingText, 'id'>;
} {
  // Check dodge
  if (rollDodge(boss.stats.dodgeChance)) {
    return {
      damage: 0,
      isCrit: false,
      isDodged: true,
      statusApplied: false,
      floatingText: { text: 'MISS', type: 'miss', x: 600, y: 200 },
    };
  }

  const isMagic = skill.damageType !== 'physical';
  const berserkBonus = getBerserkBonus(hero.statusEffects);
  let damage = calculateDamage(
    skill.baseDamage,
    hero.stats.attack,
    boss.stats.defense,
    boss.stats.magicResist,
    isMagic,
    berserkBonus,
  );

  const isCrit = rollCrit(hero.stats.critChance);
  if (isCrit) {
    damage = applyCrit(damage, hero.stats.critMultiplier);
  }

  // Boss phase enrage
  const currentPhase = boss.phases[boss.currentPhase];
  // Defense buff from boss phase is handled differently

  const statusApplied = !!(skill.statusEffect && Math.random() < 0.7);

  return {
    damage,
    isCrit,
    isDodged: false,
    statusApplied,
    floatingText: {
      text: isCrit ? `${damage} CRIT!` : `${damage}`,
      type: isCrit ? 'crit' : 'normal',
      x: 580 + Math.random() * 80,
      y: 160 + Math.random() * 60,
    },
  };
}

/**
 * Resolve boss attacking a hero
 */
export function resolveBossAttack(
  boss: BossData,
  hero: HeroData,
  skill: Skill,
): {
  damage: number;
  isCrit: boolean;
  isDodged: boolean;
  statusApplied: boolean;
  floatingText: Omit<FloatingText, 'id'>;
} {
  // Check hero dodge
  if (rollDodge(hero.stats.dodgeChance)) {
    return {
      damage: 0,
      isCrit: false,
      isDodged: true,
      statusApplied: false,
      floatingText: { text: 'DODGE!', type: 'miss', x: 200, y: 300 },
    };
  }

  const isMagic = skill.damageType !== 'physical';
  const phase = boss.phases[boss.currentPhase];
  const enrage = phase?.enrageMultiplier ?? 1;

  let damage = calculateDamage(
    skill.baseDamage * enrage,
    boss.stats.attack,
    hero.stats.defense,
    hero.stats.magicResist,
    isMagic,
  );

  // Shield reduces damage
  const shield = hero.statusEffects.find((e) => e.type === 'shield');
  if (shield) {
    damage = Math.max(1, damage - shield.value);
  }

  const isCrit = rollCrit(boss.stats.critChance);
  if (isCrit) {
    damage = applyCrit(damage, boss.stats.critMultiplier);
  }

  const statusApplied = !!(skill.statusEffect && Math.random() < 0.6);

  const heroIndex = Math.random(); // Simplified position
  return {
    damage,
    isCrit,
    isDodged: false,
    statusApplied,
    floatingText: {
      text: isCrit ? `${damage} CRIT!` : `${damage}`,
      type: isCrit ? 'crit' : 'normal',
      x: 100 + heroIndex * 150,
      y: 280 + Math.random() * 40,
    },
  };
}

/**
 * Check if boss should advance to next phase
 */
export function shouldAdvancePhase(boss: BossData): boolean {
  const hpPercent = boss.stats.hp / boss.stats.maxHp;
  const nextPhase = boss.phases[boss.currentPhase + 1];
  if (!nextPhase) return false;
  return hpPercent <= nextPhase.hpThreshold;
}

/**
 * Check if riddle should trigger
 */
export function shouldTriggerRiddle(boss: BossData): boolean {
  const hpPercent = boss.stats.hp / boss.stats.maxHp;
  return hpPercent <= 0.2 && !boss.riddleTriggered;
}

/**
 * Get arena hazard effect
 */
export function getArenaHazard(arena: string, turnCount: number): { 
  message: string; 
  damage: number; 
  type: 'damage' | 'system';
  target: 'all' | 'random' | 'none';
} | null {
  if (turnCount % 3 !== 0 || turnCount === 0) return null;

  switch (arena) {
    case 'lava_temple':
      return { 
        message: 'Lava surges! Heroes take heat damage.', 
        damage: 20, 
        type: 'damage',
        target: 'all' 
      };
    case 'clock_temple':
      return { 
        message: 'Time distorts! Turn order shuffled.', 
        damage: 0, 
        type: 'system',
        target: 'none' 
      };
    case 'void_palace':
      return { 
        message: 'Shadows drain your energy!', 
        damage: 15, 
        type: 'damage',
        target: 'all' 
      };
    default:
      return null;
  }
}

/**
 * Pick the best boss skill based on current state
 */
export function pickBossSkill(boss: BossData): Skill {
  const available = boss.skills.filter((s) => s.currentCooldown === 0);
  if (available.length === 0) return boss.skills[0]; // fallback to basic

  const phase = boss.phases[boss.currentPhase];
  // Prefer phase special attack
  const special = available.find((s) => s.id === phase?.specialAttack);
  if (special && Math.random() < 0.5) return special;

  // Random weighted
  return available[Math.floor(Math.random() * available.length)];
}
