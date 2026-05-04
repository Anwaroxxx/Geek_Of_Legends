export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameConfig {
  targetFps: number;
  maxLives: number;
  startScore: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  timeElapsed: number;
}
