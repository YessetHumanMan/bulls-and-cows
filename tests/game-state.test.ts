import { describe, expect, it } from 'vitest';
import { createGame, submitGuess } from '../src/core/game-state';
import type { GameState } from '../src/types/game';

const makeState = (): GameState => ({
  settings: { length: 4, base: 10 },
  secret: '1234',
  status: 'playing',
  history: [],
  startedAt: 1000,
  finishedAt: null,
});

describe('createGame', () => {
  it('starts a round with the supplied settings, secret and time', () => {
    expect(createGame({ length: 4, base: 10 }, '1234', 1000)).toEqual(makeState());
  });

  it('creates an independent history for each round', () => {
    const first = createGame({ length: 2, base: 2 }, '01', 1000);
    const second = createGame({ length: 2, base: 2 }, '10', 2000);

    expect(first.history).toEqual([]);
    expect(second.history).toEqual([]);
    expect(first.history).not.toBe(second.history);
  });

  it('does not mutate the supplied settings', () => {
    const settings = Object.freeze({ length: 4, base: 16 as const });

    const state = createGame(settings, 'ab12', 1000);

    expect(settings).toEqual({ length: 4, base: 16 });
    expect(state.settings).toEqual(settings);
  });
});

describe('submitGuess', () => {
  it('adds an attempt with the correct bulls and cows', () => {
    const state = makeState();
    const next = submitGuess(state, '1243', 2000);

    expect(next.history).toEqual([{ guess: '1243', result: { bulls: 2, cows: 2 } }]);
    expect(next.status).toBe('playing');
    expect(next.finishedAt).toBeNull();
    expect(next.settings).toEqual(state.settings);
    expect(next.secret).toBe(state.secret);
    expect(next.startedAt).toBe(1000);
  });

  it('creates a new state and history without changing frozen originals', () => {
    const state = makeState();
    Object.freeze(state.settings);
    Object.freeze(state.history);
    Object.freeze(state);

    const next = submitGuess(state, '5678', 2000);

    expect(next).not.toBe(state);
    expect(next.history).not.toBe(state.history);
    expect(state).toEqual(makeState());
  });

  it('preserves previous history entries', () => {
    const entry = Object.freeze({
      guess: '5678',
      result: Object.freeze({ bulls: 0, cows: 0 }),
    });
    const state: GameState = { ...makeState(), history: Object.freeze([entry]) };

    const next = submitGuess(state, '1243', 3000);

    expect(state.history).toEqual([entry]);
    expect(next.history).toHaveLength(2);
    expect(next.history[0]).toEqual(entry);
    expect(next.history[1]).toEqual({ guess: '1243', result: { bulls: 2, cows: 2 } });
  });

  it.each(['123', '1123', '12a4', '12345', ''])('ignores invalid guess %j', (guess) => {
    const state = makeState();

    expect(submitGuess(state, guess, 2000)).toBe(state);
  });

  it('ignores an already submitted guess', () => {
    const state: GameState = {
      ...makeState(),
      history: [{ guess: '1243', result: { bulls: 2, cows: 2 } }],
    };

    expect(submitGuess(state, '1243', 3000)).toBe(state);
  });

  it('normalizes uppercase hex guesses', () => {
    const state: GameState = {
      ...makeState(),
      settings: { length: 4, base: 16 },
      secret: 'ab12',
    };

    const next = submitGuess(state, 'AB34', 2000);

    expect(next.history).toEqual([{ guess: 'ab34', result: { bulls: 2, cows: 0 } }]);
  });

  it('treats differently cased hex guesses as duplicates', () => {
    const state: GameState = {
      ...makeState(),
      settings: { length: 4, base: 16 },
      secret: 'ab12',
      history: [{ guess: 'ab34', result: { bulls: 2, cows: 0 } }],
    };

    expect(submitGuess(state, 'AB34', 3000)).toBe(state);
  });

  it('finishes the round and counts the winning attempt', () => {
    const state: GameState = {
      ...makeState(),
      history: [{ guess: '5678', result: { bulls: 0, cows: 0 } }],
    };

    const next = submitGuess(state, '1234', 4500);

    expect(next.status).toBe('won');
    expect(next.history).toHaveLength(2);
    expect(next.history[1]).toEqual({ guess: '1234', result: { bulls: 4, cows: 0 } });
    expect(next.finishedAt).toBe(4500);
    expect(next.finishedAt! - next.startedAt).toBe(3500);
    expect(state.status).toBe('playing');
    expect(state.finishedAt).toBeNull();
  });

  it('recognizes a winning guess regardless of hex case', () => {
    const state: GameState = {
      ...makeState(),
      settings: { length: 4, base: 16 },
      secret: 'aB12',
    };

    expect(submitGuess(state, 'Ab12', 2000).status).toBe('won');
  });

  it('does not accept guesses after a win or change the finish time', () => {
    const state: GameState = {
      ...makeState(),
      status: 'won',
      history: [{ guess: '1234', result: { bulls: 4, cows: 0 } }],
      finishedAt: 2000,
    };

    expect(submitGuess(state, '5678', 5000)).toBe(state);
  });
});
