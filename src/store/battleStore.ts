// ============================================
// BATTLE STORE — Combat state management
// ============================================
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { BossData, BossId, CombatLog, FloatingText, Skill } from '../types/Game';
import { BOSS_STATS } from '../constants/balance';

interface BattleState {
  boss: BossData | null;
  turnCount: number;
  currentTurnHeroId: string | null;
  selectedSkill: Skill | null;
  isPlayerTurn: boolean;
  isBossTurn: boolean;
  isAnimating: boolean;
  combatLog: CombatLog[];
  floatingTexts: FloatingText[];
  battleActive: boolean;
  waveNumber: number;
  battlePhase: 'wave' | 'elite' | 'boss';
  momentum: number; // 0-100
  eclipseState: boolean;

  initBoss: (id: BossId) => void;
  damageBoss: (amount: number) => void;
  healBoss: (amount: number) => void;
  setCurrentTurnHero: (id: string | null) => void;
  setSelectedSkill: (skill: Skill | null) => void;
  setPlayerTurn: (v: boolean) => void;
  setBossTurn: (v: boolean) => void;
  setAnimating: (v: boolean) => void;
  advanceTurn: () => void;
  addCombatLog: (entry: Omit<CombatLog, 'id'>) => void;
  addFloatingText: (text: Omit<FloatingText, 'id'>) => void;
  removeFloatingText: (id: string) => void;
  clearFloatingTexts: () => void;
  setBattleActive: (v: boolean) => void;
  advanceBossPhase: () => void;
  nextWave: () => void;
  resetBattle: () => void;
  addMomentum: (amount: number) => void;
  setEclipseState: (v: boolean) => void;
}

const BOSS_DATA: Record<BossId, Omit<BossData, 'stats' | 'isAlive' | 'riddleTriggered' | 'statusEffects' | 'currentPhase'>> = {
  sauron: {
    id: 'sauron',
    name: 'Sauron',
    title: 'Flame Tyrant',
    skills: [
      {
        id: 'flame_slash', name: 'Flame Slash', description: 'A fiery slash.',
        type: 'damage', damageType: 'fire', baseDamage: 80, mpCost: 0,
        cooldown: 0, currentCooldown: 0, targetAll: false, icon: 'FLS', vfx: 'flame_slash',
      },
      {
        id: 'lava_eruption', name: 'Lava Eruption', description: 'Lava explodes from the ground, hitting all heroes.',
        type: 'aoe', damageType: 'fire', baseDamage: 55, mpCost: 0,
        cooldown: 3, currentCooldown: 0, targetAll: true, statusEffect: 'burn', statusDuration: 2, statusValue: 18,
        icon: 'LVA', vfx: 'lava_eruption',
      },
      {
        id: 'fire_breath', name: 'Fire Breath', description: 'A devastating cone of fire.',
        type: 'aoe', damageType: 'fire', baseDamage: 95, mpCost: 0,
        cooldown: 5, currentCooldown: 0, targetAll: true, icon: 'FBR', vfx: 'fire_breath',
      },
      {
        id: 'sun_strike', name: 'Eclipse: Sun Strike', description: 'Focused solar energy incinerates a target.',
        type: 'damage', damageType: 'fire', baseDamage: 180, mpCost: 0,
        cooldown: 0, currentCooldown: 0, targetAll: false, icon: 'SUN', vfx: 'sun_strike',
      },
    ],
    phases: [
      { id: 1, name: 'The Awakening', hpThreshold: 1.0, specialAttack: 'flame_slash' },
      { id: 2, name: 'Inferno Rising', hpThreshold: 0.6, specialAttack: 'lava_eruption', enrageMultiplier: 1.3 },
      { id: 3, name: 'Apocalypse', hpThreshold: 0.3, specialAttack: 'fire_breath', aura: 'fire', enrageMultiplier: 1.6 },
      { id: 4, name: 'Solar Flare', hpThreshold: 0.1, specialAttack: 'sun_strike', aura: 'eclipse', enrageMultiplier: 2.0 },
    ],
    portrait: 'sauron',
    arena: 'lava_temple',
  },
  chronos: {
    id: 'chronos',
    name: 'Chronos',
    title: 'Lord of Time',
    skills: [
      {
        id: 'time_strike', name: 'Time Strike', description: 'A strike warped through time.',
        type: 'damage', damageType: 'arcane', baseDamage: 70, mpCost: 0,
        cooldown: 0, currentCooldown: 0, targetAll: false, icon: 'TMS', vfx: 'time_strike',
      },
      {
        id: 'temporal_freeze', name: 'Temporal Freeze', description: 'Freezes a hero in time.',
        type: 'debuff', damageType: 'arcane', baseDamage: 30, mpCost: 0,
        cooldown: 3, currentCooldown: 0, targetAll: false, statusEffect: 'freeze', statusDuration: 2, statusValue: 0,
        icon: 'FRZ', vfx: 'temporal_freeze',
      },
      {
        id: 'rewind', name: 'Rewind', description: 'Chronos rewinds time, healing himself.',
        type: 'heal', damageType: 'arcane', baseDamage: 0, mpCost: 0,
        cooldown: 5, currentCooldown: 0, targetAll: false, icon: 'RWD', vfx: 'rewind',
      },
      {
        id: 'time_stop', name: 'Eclipse: Time Stop', description: 'Stops time for all heroes.',
        type: 'debuff', damageType: 'arcane', baseDamage: 100, mpCost: 0,
        cooldown: 0, currentCooldown: 0, targetAll: true, statusEffect: 'stun', statusDuration: 1, statusValue: 0,
        icon: 'STP', vfx: 'time_stop',
      },
    ],
    phases: [
      { id: 1, name: 'Time Begins', hpThreshold: 1.0, specialAttack: 'time_strike' },
      { id: 2, name: 'Temporal Shift', hpThreshold: 0.5, specialAttack: 'temporal_freeze', enrageMultiplier: 1.4 },
      { id: 3, name: 'End of Time', hpThreshold: 0.25, specialAttack: 'rewind', aura: 'time', enrageMultiplier: 1.7 },
      { id: 4, name: 'The Void', hpThreshold: 0.05, specialAttack: 'time_stop', aura: 'eclipse', enrageMultiplier: 2.5 },
    ],
    portrait: 'chronos',
    arena: 'clock_temple',
  },
  lilith: {
    id: 'lilith',
    name: 'Lilith',
    title: 'Queen of Shadows',
    skills: [
      {
        id: 'shadow_bolt', name: 'Shadow Bolt', description: 'A bolt of dark energy.',
        type: 'damage', damageType: 'shadow', baseDamage: 60, mpCost: 0,
        cooldown: 0, currentCooldown: 0, targetAll: false, icon: 'SHD', vfx: 'shadow_bolt',
      },
      {
        id: 'charm', name: 'Enchanting Gaze', description: 'Charms a hero, stunning them.',
        type: 'debuff', damageType: 'shadow', baseDamage: 20, mpCost: 0,
        cooldown: 3, currentCooldown: 0, targetAll: false, statusEffect: 'charm', statusDuration: 2, statusValue: 0,
        icon: 'CHM', vfx: 'charm',
      },
      {
        id: 'darkness_wave', name: 'Darkness Wave', description: 'A wave of pure darkness engulfs all heroes.',
        type: 'aoe', damageType: 'shadow', baseDamage: 70, mpCost: 0,
        cooldown: 4, currentCooldown: 0, targetAll: true, icon: 'DRK', vfx: 'darkness_wave',
      },
      {
        id: 'abyss_stare', name: 'Eclipse: Abyss Stare', description: 'Lilith stares into your soul, dealing massive true damage.',
        type: 'damage', damageType: 'true', baseDamage: 250, mpCost: 0,
        cooldown: 0, currentCooldown: 0, targetAll: false, icon: 'ABY', vfx: 'abyss_stare',
      },
    ],
    phases: [
      { id: 1, name: 'The Whisper', hpThreshold: 1.0, specialAttack: 'shadow_bolt' },
      { id: 2, name: 'Nightmare', hpThreshold: 0.55, specialAttack: 'charm', enrageMultiplier: 1.3 },
      { id: 3, name: 'Void Collapse', hpThreshold: 0.2, specialAttack: 'darkness_wave', aura: 'shadow', enrageMultiplier: 1.8 },
      { id: 4, name: 'Eternal Night', hpThreshold: 0.08, specialAttack: 'abyss_stare', aura: 'eclipse', enrageMultiplier: 2.2 },
    ],
    portrait: 'lilith',
    arena: 'void_palace',
  },
};

export const useBattleStore = create<BattleState>((set) => ({
  boss: null,
  turnCount: 0,
  currentTurnHeroId: null,
  selectedSkill: null,
  isPlayerTurn: true,
  isBossTurn: false,
  isAnimating: false,
  combatLog: [],
  floatingTexts: [],
  battleActive: false,
  waveNumber: 1,
  battlePhase: 'wave',
  momentum: 0,
  eclipseState: false,

  initBoss: (id) => {
    const template = BOSS_DATA[id];
    const stats = { ...BOSS_STATS[id] };
    const boss: BossData = {
      ...template,
      stats,
      isAlive: true,
      riddleTriggered: false,
      statusEffects: [],
      currentPhase: 0,
    };
    set({ boss, turnCount: 0, combatLog: [], floatingTexts: [], battleActive: true, isPlayerTurn: true, isBossTurn: false, momentum: 0, eclipseState: false });
  },

  damageBoss: (amount) => set((s) => {
    if (!s.boss) return s;
    const newHp = Math.max(0, s.boss.stats.hp - amount);
    return {
      boss: {
        ...s.boss,
        stats: { ...s.boss.stats, hp: newHp },
        isAlive: newHp > 0,
      },
    };
  }),

  healBoss: (amount) => set((s) => {
    if (!s.boss) return s;
    const newHp = Math.min(s.boss.stats.maxHp, s.boss.stats.hp + amount);
    return { boss: { ...s.boss, stats: { ...s.boss.stats, hp: newHp } } };
  }),

  setCurrentTurnHero: (id) => set({ currentTurnHeroId: id }),
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  setPlayerTurn: (v) => set({ isPlayerTurn: v }),
  setBossTurn: (v) => set({ isBossTurn: v }),
  setAnimating: (v) => set({ isAnimating: v }),

  advanceTurn: () => set((s) => ({ turnCount: s.turnCount + 1 })),

  addCombatLog: (entry) => set((s) => ({
    combatLog: [...s.combatLog, { ...entry, id: uuid() }],
  })),

  addFloatingText: (text) => set((s) => ({
    floatingTexts: [...s.floatingTexts, { ...text, id: uuid() }],
  })),

  removeFloatingText: (id) => set((s) => ({
    floatingTexts: s.floatingTexts.filter((t) => t.id !== id),
  })),

  clearFloatingTexts: () => set({ floatingTexts: [] }),

  setBattleActive: (v) => set({ battleActive: v }),

  advanceBossPhase: () => set((s) => {
    if (!s.boss) return s;
    return { boss: { ...s.boss, currentPhase: s.boss.currentPhase + 1 } };
  }),

  nextWave: () => set((s) => ({
    waveNumber: s.waveNumber + 1,
    battlePhase: s.waveNumber >= 2 ? 'boss' : 'elite',
  })),

  resetBattle: () => set({
    boss: null,
    turnCount: 0,
    currentTurnHeroId: null,
    selectedSkill: null,
    isPlayerTurn: true,
    isBossTurn: false,
    isAnimating: false,
    combatLog: [],
    floatingTexts: [],
    battleActive: false,
    waveNumber: 1,
    battlePhase: 'wave',
    momentum: 0,
    eclipseState: false,
  }),

  addMomentum: (amount) => set((s) => ({
    momentum: Math.min(100, Math.max(0, s.momentum + amount))
  })),

  setEclipseState: (v) => set({ eclipseState: v }),
}));
