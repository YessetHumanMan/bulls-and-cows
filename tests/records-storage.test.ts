import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadRecords, saveRecords } from '../src/storage/records-storage';
import type { GameRecord } from '../src/types/record';

const record: GameRecord = {
  id: 'first',
  length: 4,
  base: 10,
  attempts: 3,
  durationMs: 2500,
  completedAt: '2026-01-01T12:00:00.000Z',
};

const mockStorage = (data: string | null = null) => {
  const storage = {
    getItem: vi.fn<(key: string) => string | null>(() => data),
    setItem: vi.fn<(key: string, value: string) => void>(),
  };
  vi.stubGlobal('localStorage', storage);
  return storage;
};

afterEach(() => vi.unstubAllGlobals());

describe('loadRecords', () => {
  it('returns an empty list when nothing has been saved', () => {
    const storage = mockStorage();

    expect(loadRecords()).toEqual([]);
    expect(storage.getItem).toHaveBeenCalledWith('bulls-and-cows-records');
  });

  it('loads and sorts saved records', () => {
    const better = { ...record, id: 'better', attempts: 1 };
    mockStorage(JSON.stringify([record, better]));

    expect(loadRecords()).toEqual([better, record]);
  });

  it.each(['broken json', '{}', 'null'])('handles invalid stored data %s', (data) => {
    mockStorage(data);

    expect(loadRecords()).toEqual([]);
  });

  it('discards invalid entries and keeps valid records', () => {
    mockStorage(
      JSON.stringify([
        null,
        {},
        { ...record, attempts: 0 },
        { ...record, base: 3 },
        { ...record, length: 5, base: 2 },
        { ...record, durationMs: -1 },
        { ...record, completedAt: 'invalid' },
        record,
      ]),
    );

    expect(loadRecords()).toEqual([record]);
  });

  it('handles unavailable storage', () => {
    const storage = mockStorage();
    storage.getItem.mockImplementation(() => {
      throw new Error('Storage blocked');
    });

    expect(loadRecords()).toEqual([]);
  });
});

describe('saveRecords', () => {
  it('saves records as JSON', () => {
    const storage = mockStorage();

    expect(saveRecords([record])).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith(
      'bulls-and-cows-records',
      JSON.stringify([record]),
    );
  });

  it('saves only the top ten without changing the source list', () => {
    const storage = mockStorage();
    const records = Object.freeze(
      Array.from({ length: 12 }, (_, index) => ({
        ...record,
        id: String(index),
        attempts: 12 - index,
      })),
    );

    saveRecords(records);
    const saved = JSON.parse(storage.setItem.mock.calls[0][1]) as GameRecord[];

    expect(saved).toHaveLength(10);
    expect(saved.map((entry) => entry.attempts)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(records[0].attempts).toBe(12);
  });

  it('reports a storage write failure', () => {
    const storage = mockStorage();
    storage.setItem.mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    expect(saveRecords([record])).toBe(false);
  });
});
