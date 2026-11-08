import type { GameSettings, GameState } from '../types/game';
import { evaluateGuess } from './evaluate-guess';
import { isValidGuess } from './validate-guess';

export const createGame = (
  settings: GameSettings,
  secret: string,
  startedAt: number,
): GameState => {
  return {
    settings: { ...settings },
    secret: secret.toLowerCase(),
    status: 'playing',
    history: [],
    startedAt,
    finishedAt: null,
  };
};

export const submitGuess = (state: GameState, guess: string, submittedAt: number): GameState => {
  const normalizedGuess = guess.toLowerCase();
  const { length, base } = state.settings;

  if (state.status !== 'playing' || !isValidGuess(normalizedGuess, length, base)) return state;
  if (state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess)) return state;

  const result = evaluateGuess(state.secret, normalizedGuess);
  const won = result.bulls === length;

  return {
    ...state,
    history: [...state.history, { guess: normalizedGuess, result }],
    status: won ? 'won' : 'playing',
    finishedAt: won ? submittedAt : null,
  };
};
