import type { Attempt } from '../types/game';

export const createHistoryEntry = (attempt: Attempt): HTMLLIElement => {
  const entry = document.createElement('li');
  entry.textContent = `${attempt.guess} — Bulls: ${attempt.result.bulls}, cows: ${attempt.result.cows}`;
  return entry;
};
