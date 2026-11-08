import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/core/evaluate-guess';

describe('evaluateGuess', () => {
  it.each([
    ['1234', '1234', 4, 0],
    ['1234', '4321', 0, 4],
    ['1234', '5678', 0, 0],
    ['1234', '1567', 1, 0],
    ['1234', '1243', 2, 2],
    ['1234', '1523', 1, 2],
    ['1234', '5671', 0, 1],
  ])('compares secret %s and guess %s: %i bulls, %i cows', (secret, guess, bulls, cows) => {
    expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
  });

  it('preserves leading zeros', () => {
    expect(evaluateGuess('0123', '0312')).toEqual({ bulls: 1, cows: 3 });
  });

  it.each([
    ['01', '01', 2, 0],
    ['01', '10', 0, 2],
    ['012345', '543210', 0, 6],
  ])('supports secret %s and guess %s: %i bulls, %i cows', (secret, guess, bulls, cows) => {
    expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
  });

  it.each([
    ['ab12', 'AB12', 4, 0],
    ['AB12', 'ab12', 4, 0],
    ['a1Bf', 'A2Fb', 1, 2],
    ['AbCd', 'dCbA', 0, 4],
  ])('ignores hex case for secret %s and guess %s', (secret, guess, bulls, cows) => {
    expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
  });

  it('does not count a bull as a cow', () => {
    expect(evaluateGuess('abcd', 'abef')).toEqual({ bulls: 2, cows: 0 });
  });

  it('returns the same result on repeated calls', () => {
    const expected = { bulls: 2, cows: 2 };

    expect(evaluateGuess('1234', '1243')).toEqual(expected);
    expect(evaluateGuess('1234', '1243')).toEqual(expected);
  });
});
