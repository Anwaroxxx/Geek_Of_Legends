// ============================================
// GAME STORE — Global state management
// ============================================
import { create } from 'zustand';
import type { GamePhase, BossId } from '../types/Game';

interface GameState {
  phase: GamePhase;
  currentBossId: BossId;
  gold: number;
  runsCompleted: number;
  isLoading: boolean;
  isPaused: boolean;
  defeatedBosses: BossId[];

  setPhase: (phase: GamePhase) => void;
  setCurrentBoss: (id: BossId) => void;
  markBossDefeated: (id: BossId) => void;
  resetDefeatedBosses: () => void;
  addGold: (amount: number) => void;
  incrementRuns: () => void;
  setLoading: (v: boolean) => void;
  setPaused: (v: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'menu',
  currentBossId: 'sauron',
  gold: 0,
  runsCompleted: 0,
  isLoading: false,
  isPaused: false,
  defeatedBosses: [],

  setPhase: (phase) => set({ phase }),
  setCurrentBoss: (id) => set({ currentBossId: id }),
  markBossDefeated: (id) => set((s) => ({ 
    defeatedBosses: s.defeatedBosses.includes(id) ? s.defeatedBosses : [...s.defeatedBosses, id] 
  })),
  resetDefeatedBosses: () => set({ defeatedBosses: [] }),
  addGold: (amount) => set((s) => ({ gold: s.gold + amount })),
  incrementRuns: () => set((s) => ({ runsCompleted: s.runsCompleted + 1 })),
  setLoading: (v) => set({ isLoading: v }),
  setPaused: (v) => set({ isPaused: v }),
  resetGame: () => set({
    phase: 'menu',
    currentBossId: 'sauron',
    gold: 0,
    runsCompleted: 0,
    isLoading: false,
    isPaused: false,
    defeatedBosses: [],
  }),
}));
