import type { GameRecord } from '../types/record';

export const sortRecords = (records: readonly GameRecord[], limit = 10): GameRecord[] => {
  return [...records]
    .sort((left, right) => left.attempts - right.attempts || left.durationMs - right.durationMs)
    .slice(0, limit);
};
