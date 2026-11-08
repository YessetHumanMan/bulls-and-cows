import { describe, expect, it } from 'vitest';
import { isValidGuess } from '../src/core/validate-guess';

describe('isValidGuess', () => {
  it.each([
    ['01', 2, 2],
    ['7654', 4, 8],
    ['1234', 4, 10],
    ['09af', 4, 16],
    ['ABCDEF', 6, 16],
    ['aBcD', 4, 16],
  ])('accepts valid guess %s with length %i in base %i', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(true);
  });

  it('accepts a leading zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it.each(['', '123', '12345'])('rejects incorrect length for %j', (guess) => {
    expect(isValidGuess(guess, 4, 10)).toBe(false);
  });

  it.each([
    ['02', 2, 2],
    ['78', 2, 8],
    ['1a', 2, 10],
    ['fg', 2, 16],
    ['1 ', 2, 10],
    ['-1', 2, 10],
    ['1.', 2, 10],
  ])('rejects invalid digits in %j for length %i and base %i', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });

  it.each([
    ['00', 2, 2],
    ['1223', 4, 10],
    ['abca', 4, 16],
    ['aA12', 4, 16],
    ['fF', 2, 16],
  ])('rejects repeated digits in %s for length %i and base %i', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });

  it('rejects a guess longer than the available alphabet', () => {
    expect(isValidGuess('010', 3, 2)).toBe(false);
  });
});
