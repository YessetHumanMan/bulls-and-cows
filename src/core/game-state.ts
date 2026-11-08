import type { GameSettings, GameState } from '../types/game';

export const createGame = (
  settings: GameSettings,
  secret: string,
  startedAt: number,
): GameState => {
  void settings;
  void secret;
  void startedAt;
  throw new Error('Not implemented');
};

export const submitGuess = (state: GameState, guess: string, submittedAt: number): GameState => {
  void state;
  void guess;
  void submittedAt;
  throw new Error('Not implemented');
};
