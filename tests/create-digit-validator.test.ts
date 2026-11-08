import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/core/digit-validator';

describe('createDigitValidator', () => {
  it.each([
    [2, '01'],
    [8, '01234567'],
    [10, '0123456789'],
    [16, '0123456789abcdef'],
  ])('accepts every digit in base %i', (base, digits) => {
    const isValidDigit = createDigitValidator(base);

    for (const digit of digits) {
      expect(isValidDigit(digit)).toBe(true);
    }
  });

  it.each([
    [2, '2'],
    [8, '8'],
    [10, 'a'],
    [16, 'g'],
  ])('rejects digits outside base %i', (base, digit) => {
    const isValidDigit = createDigitValidator(base);

    expect(isValidDigit(digit)).toBe(false);
  });

  it.each(['A', 'B', 'C', 'D', 'E', 'F'])('accepts uppercase hex digit %s', (digit) => {
    const isValidDigit = createDigitValidator(16);

    expect(isValidDigit(digit)).toBe(true);
    expect(isValidDigit(digit)).toBe(isValidDigit(digit.toLowerCase()));
  });

  it.each(['', '01', 'ab', ' ', '\n', '-', '.', '💡'])('rejects invalid input %j', (input) => {
    const isValidDigit = createDigitValidator(16);

    expect(isValidDigit(input)).toBe(false);
  });

  it('keeps validators for different bases independent', () => {
    const isBinaryDigit = createDigitValidator(2);
    const isHexDigit = createDigitValidator(16);

    expect(isHexDigit('f')).toBe(true);
    expect(isBinaryDigit('f')).toBe(false);
    expect(isBinaryDigit('1')).toBe(true);
  });
});
