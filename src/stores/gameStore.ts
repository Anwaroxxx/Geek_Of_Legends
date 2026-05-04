import { create } from 'zustand';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  isPaused: () => boolean;
  isPlaying: () => boolean;
  isGameOver: () => boolean;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'menu',

  setGameState: (state: GameState) => set({ gameState: state }),

  isPaused: () => {
    const state = useGameStore.getState();
    return state.gameState === 'paused';
  },

  isPlaying: () => {
    const state = useGameStore.getState();
    return state.gameState === 'playing';
  },

  isGameOver: () => {
    const state = useGameStore.getState();
    return state.gameState === 'gameover';
  },

  resetGame: () => set({ gameState: 'menu' }),
}));
