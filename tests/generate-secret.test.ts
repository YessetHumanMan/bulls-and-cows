import { describe, expect, it, vi } from 'vitest';
import { generateSecret } from '../src/core/generate-secret';

const DIGITS = '0123456789abcdef';

describe('generateSecret', () => {
  it.each([
    [2, 2],
    [4, 8],
    [4, 10],
    [6, 16],
  ])('generates %i unique digits in base %i', (length, base) => {
    const secret = generateSecret(length, base, () => 0.5);

    expect(secret).toHaveLength(length);
    expect(new Set(secret).size).toBe(length);
    expect([...secret].every((digit) => DIGITS.slice(0, base).includes(digit))).toBe(true);
  });

  it('can use the entire binary alphabet', () => {
    const secret = generateSecret(2, 2, () => 0);

    expect([...secret].sort()).toEqual(['0', '1']);
  });

  it('allows a leading zero', () => {
    const secret = generateSecret(4, 10, () => 0.999);

    expect(secret.startsWith('0')).toBe(true);
    expect(secret).toHaveLength(4);
  });

  it('returns the same secret for the same deterministic random source', () => {
    const first = generateSecret(6, 16, () => 0.25);
    const second = generateSecret(6, 16, () => 0.25);

    expect(first).toBe(second);
  });

  it('uses the supplied random source', () => {
    const random = vi.fn(() => 0.5);

    generateSecret(4, 10, random);

    expect(random).toHaveBeenCalled();
  });

  it('handles a random source that always returns zero', () => {
    const secret = generateSecret(6, 16, () => 0);

    expect(secret).toHaveLength(6);
    expect(new Set(secret).size).toBe(6);
  });

  it.each([
    [3, 2],
    [-1, 10],
    [2.5, 10],
    [2, 0],
    [2, 17],
    [2, 10.5],
  ])('rejects invalid length %i or base %i', (length, base) => {
    expect(() => generateSecret(length, base, () => 0.5)).toThrow(RangeError);
  });
});
