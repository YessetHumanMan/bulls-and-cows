import { createDigitValidator } from './digit-validator';

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  const digits = [...guess.toLowerCase()];
  const isValidDigit = createDigitValidator(base);

  return digits.length === length && digits.every(isValidDigit) && new Set(digits).size === length;
};
