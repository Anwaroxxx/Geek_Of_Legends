// ============================================
// HERO STORE — Party & hero management
// ============================================
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { HeroData, HeroClass, Skill } from '../types/Game';
import { BASE_STATS } from '../constants/balance';
import { getSkillsForClass } from '../data/skills/skillData';

interface HeroState {
  heroes: HeroData[];

  createHero: (name: string, heroClass: HeroClass) => void;
  removeHero: (id: string) => void;
  clearParty: () => void;
  updateHeroStats: (id: string, stats: Partial<HeroData['stats']>) => void;
  damageHero: (id: string, amount: number) => void;
  healHero: (id: string, amount: number) => void;
  killHero: (id: string) => void;
  reviveHero: (id: string, hpPercent: number) => void;
  spendMp: (id: string, amount: number) => void;
  addRage: (id: string, amount: number) => void;
  spendArrow: (id: string, count: number) => void;
  putSkillOnCooldown: (heroId: string, skillId: string) => void;
  tickCooldowns: () => void;
  resetForBattle: () => void;
  addXp: (id: string, amount: number) => void;
  addRelic: (heroId: string, relicId: string) => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  heroes: [],

  createHero: (name, heroClass) => set((state) => {
    if (state.heroes.length >= 3) return state;
    const baseStats = { ...BASE_STATS[heroClass] };
    const skills: Skill[] = getSkillsForClass(heroClass);

    const hero: HeroData = {
      id: uuid(),
      name,
      heroClass,
      level: 1,
      xp: 0,
      xpToNext: 100,
      stats: { ...baseStats },
      skills,
      statusEffects: [],
      portrait: heroClass,  // just use class name as key, no emojis
      isAlive: true,
      relics: [],
      ...(heroClass === 'warrior' ? { rage: 0, maxRage: 100 } : {}),
      ...(heroClass === 'archer' ? { arrows: 20, maxArrows: 20 } : {}),
    };
    return { heroes: [...state.heroes, hero] };
  }),

  removeHero: (id) => set((s) => ({ heroes: s.heroes.filter((h) => h.id !== id) })),
  clearParty: () => set({ heroes: [] }),

  updateHeroStats: (id, stats) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === id ? { ...h, stats: { ...h.stats, ...stats } } : h
    ),
  })),

  damageHero: (id, amount) => set((s) => ({
    heroes: s.heroes.map((h) => {
      if (h.id !== id) return h;
      const newHp = Math.max(0, h.stats.hp - amount);
      return { ...h, stats: { ...h.stats, hp: newHp }, isAlive: newHp > 0 };
    }),
  })),

  healHero: (id, amount) => set((s) => ({
    heroes: s.heroes.map((h) => {
      if (h.id !== id) return h;
      const newHp = Math.min(h.stats.maxHp, h.stats.hp + amount);
      return { ...h, stats: { ...h.stats, hp: newHp } };
    }),
  })),

  killHero: (id) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === id ? { ...h, stats: { ...h.stats, hp: 0 }, isAlive: false } : h
    ),
  })),

  reviveHero: (id, hpPercent) => set((s) => ({
    heroes: s.heroes.map((h) => {
      if (h.id !== id) return h;
      const hp = Math.floor(h.stats.maxHp * hpPercent);
      return { ...h, stats: { ...h.stats, hp }, isAlive: true };
    }),
  })),

  spendMp: (id, amount) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === id ? { ...h, stats: { ...h.stats, mp: Math.min(h.stats.maxMp, Math.max(0, h.stats.mp - amount)) } } : h
    ),
  })),

  addRage: (id, amount) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === id && h.rage !== undefined
        ? { ...h, rage: Math.min(h.maxRage ?? 100, Math.max(0, h.rage + amount)) }
        : h
    ),
  })),

  spendArrow: (id, count) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === id && h.arrows !== undefined
        ? { ...h, arrows: Math.min(h.maxArrows ?? 20, Math.max(0, h.arrows - count)) }
        : h
    ),
  })),

  putSkillOnCooldown: (heroId, skillId) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === heroId
        ? {
            ...h,
            skills: h.skills.map((sk) =>
              sk.id === skillId ? { ...sk, currentCooldown: sk.cooldown } : sk
            ),
          }
        : h
    ),
  })),

  tickCooldowns: () => set((s) => ({
    heroes: s.heroes.map((h) => ({
      ...h,
      skills: h.skills.map((sk) => ({
        ...sk,
        currentCooldown: Math.max(0, sk.currentCooldown - 1),
      })),
    })),
  })),

  resetForBattle: () => set((s) => ({
    heroes: s.heroes.map((h) => ({
      ...h,
      stats: { ...h.stats, hp: h.stats.maxHp, mp: h.stats.maxMp },
      isAlive: true,
      statusEffects: [],
      skills: h.skills.map((sk) => ({ ...sk, currentCooldown: 0 })),
      ...(h.heroClass === 'warrior' ? { rage: 0 } : {}),
      ...(h.heroClass === 'archer' ? { arrows: h.maxArrows ?? 20 } : {}),
    })),
  })),

  addXp: (id, amount) => set((s) => ({
    heroes: s.heroes.map((h) => {
      if (h.id !== id) return h;
      let newXp = h.xp + amount;
      let newLevel = h.level;
      let xpToNext = h.xpToNext;
      while (newXp >= xpToNext && newLevel < 10) {
        newXp -= xpToNext;
        newLevel++;
        xpToNext = newLevel * 100 + 50;
      }
      return { ...h, xp: newXp, level: newLevel, xpToNext };
    }),
  })),

  addRelic: (heroId, relicId) => set((s) => ({
    heroes: s.heroes.map((h) =>
      h.id === heroId ? { ...h, relics: [...h.relics, relicId] } : h
    ),
  })),
}));
