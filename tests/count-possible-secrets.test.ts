import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from '../src/core/count-possible-secrets';

describe('countPossibleSecrets', () => {
  it.each([
    [0, 2],
    [0, 10],
    [0, 16],
  ])('returns one for empty length %i in base %i', (length, base) => {
    expect(countPossibleSecrets(length, base)).toBe(1);
  });

  it.each([
    [1, 2, 2],
    [1, 16, 16],
    [2, 2, 2],
    [2, 8, 56],
    [2, 10, 90],
    [4, 10, 5040],
    [6, 16, 5765760],
  ])('counts length %i in base %i as %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  it('includes secrets starting with zero', () => {
    expect(countPossibleSecrets(2, 2)).toBe(['01', '10'].length);
  });

  it('follows the recursive permutation formula', () => {
    expect(countPossibleSecrets(4, 10)).toBe(10 * countPossibleSecrets(3, 9));
  });

  it('returns consistent results across repeated and different calls', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it.each([
    [-1, 10],
    [2.5, 10],
    [3, 2],
    [2, 0],
    [2, 17],
    [2, 10.5],
    [NaN, 10],
    [2, NaN],
    [Infinity, 10],
    [2, Infinity],
  ])('rejects invalid length %s or base %s', (length, base) => {
    expect(() => countPossibleSecrets(length, base)).toThrow(RangeError);
  });
});
