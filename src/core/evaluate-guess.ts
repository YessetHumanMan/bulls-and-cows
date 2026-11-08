export const evaluateGuess = (secret: string, guess: string): { bulls: number; cows: number } => {
  const secretDigits = [...secret.toLowerCase()];
  const guessDigits = [...guess.toLowerCase()];
  const secretSet = new Set(secretDigits);

  const bulls = guessDigits.filter((digit, index) => digit === secretDigits[index]).length;
  const cows = guessDigits.filter(
    (digit, index) => digit !== secretDigits[index] && secretSet.has(digit),
  ).length;

  return { bulls, cows };
};
