import { sortRecords } from '../core/records';
import type { GameRecord } from '../types/record';

const STORAGE_KEY = 'bulls-and-cows-records';

const isGameRecord = (value: unknown): value is GameRecord => {
  if (typeof value !== 'object' || value === null) return false;

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'base' in value &&
    (value.base === 2 || value.base === 8 || value.base === 10 || value.base === 16) &&
    'length' in value &&
    typeof value.length === 'number' &&
    Number.isInteger(value.length) &&
    value.length >= 2 &&
    value.length <= 6 &&
    value.length <= value.base &&
    'attempts' in value &&
    typeof value.attempts === 'number' &&
    Number.isInteger(value.attempts) &&
    value.attempts > 0 &&
    'durationMs' in value &&
    typeof value.durationMs === 'number' &&
    Number.isFinite(value.durationMs) &&
    value.durationMs >= 0 &&
    'completedAt' in value &&
    typeof value.completedAt === 'string' &&
    Number.isFinite(Date.parse(value.completedAt))
  );
};

export const loadRecords = (): GameRecord[] => {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(data) ? sortRecords(data.filter(isGameRecord)) : [];
  } catch {
    return [];
  }
};

export const saveRecords = (records: readonly GameRecord[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortRecords(records)));
    return true;
  } catch {
    return false;
  }
};
