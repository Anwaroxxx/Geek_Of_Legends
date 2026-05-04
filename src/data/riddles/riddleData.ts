// ============================================
// RIDDLE DATA — Boss riddles & puzzles
// ============================================
import type { RiddleQuestion } from '../../types/Game';

export const riddlePool: RiddleQuestion[] = [
  // Logic Riddles
  {
    id: 'logic_1',
    type: 'logic',
    prompt: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    answer: 'a map',
    hint: 'Think of something you look at, not walk through.',
    timeLimit: 30,
  },
  {
    id: 'logic_2',
    type: 'logic',
    prompt: 'The more you take, the more you leave behind. What are they?',
    answer: 'footsteps',
    hint: 'Think about walking.',
    timeLimit: 30,
  },
  {
    id: 'logic_3',
    type: 'logic',
    prompt: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?',
    answer: 'an echo',
    hint: 'Shout into a canyon.',
    timeLimit: 30,
  },
  {
    id: 'logic_4',
    type: 'logic',
    prompt: 'What has keys but no locks, space but no room, and you can enter but cannot go inside?',
    answer: 'a keyboard',
    hint: 'You are using one right now.',
    timeLimit: 30,
  },
  {
    id: 'logic_5',
    type: 'logic',
    prompt: 'I am not alive, but I grow; I do not have lungs, but I need air; I do not have a mouth, but water kills me. What am I?',
    answer: 'fire',
    hint: 'The Flame Tyrant would know this well.',
    timeLimit: 30,
  },

  // Code Riddles
  {
    id: 'code_1',
    type: 'code',
    prompt: 'What does `typeof null` return in JavaScript?',
    answer: 'object',
    options: ['null', 'undefined', 'object', 'string'],
    timeLimit: 20,
  },
  {
    id: 'code_2',
    type: 'code',
    prompt: 'What is the output of: `[1,2,3].map(n => n * 2).filter(n => n > 3)`?',
    answer: '[4, 6]',
    options: ['[2, 4, 6]', '[4, 6]', '[6]', '[2, 6]'],
    timeLimit: 25,
  },
  {
    id: 'code_3',
    type: 'code',
    prompt: 'In CSS, which property creates a stacking context?',
    answer: 'z-index with position',
    options: ['display: flex', 'z-index with position', 'margin: auto', 'float: left'],
    timeLimit: 20,
  },
  {
    id: 'code_4',
    type: 'code',
    prompt: 'What does `"hello".split("").reverse().join("")` return?',
    answer: 'olleh',
    options: ['hello', 'olleh', 'hlelo', 'olelh'],
    timeLimit: 20,
  },

  // Memory Sequence
  {
    id: 'memory_1',
    type: 'memory',
    prompt: 'Remember the rune sequence, then repeat it:',
    answer: '🔥❄️⚡🌑',
    sequence: ['🔥', '❄️', '⚡', '🌑'],
    timeLimit: 15,
  },
  {
    id: 'memory_2',
    type: 'memory',
    prompt: 'Remember the element sequence:',
    answer: '⚡🔥🌑❄️⚡',
    sequence: ['⚡', '🔥', '🌑', '❄️', '⚡'],
    timeLimit: 12,
  },
  {
    id: 'memory_3',
    type: 'memory',
    prompt: 'The ancient symbols flash before you:',
    answer: '🌑⚡🔥⚡❄️🌑',
    sequence: ['🌑', '⚡', '🔥', '⚡', '❄️', '🌑'],
    timeLimit: 10,
  },

  // Typing Challenge
  {
    id: 'typing_1',
    type: 'typing',
    prompt: 'Type the incantation to seal the boss:',
    answer: 'EXORCIZAMUS TE',
    timeLimit: 10,
  },
  {
    id: 'typing_2',
    type: 'typing',
    prompt: 'Speak the words of binding:',
    answer: 'UMBRA VINCULUM',
    timeLimit: 10,
  },
];

export function getRandomRiddle(): RiddleQuestion {
  return riddlePool[Math.floor(Math.random() * riddlePool.length)];
}

export function getRandomRiddleByType(type: RiddleQuestion['type']): RiddleQuestion {
  const pool = riddlePool.filter((r) => r.type === type);
  return pool[Math.floor(Math.random() * pool.length)];
}
