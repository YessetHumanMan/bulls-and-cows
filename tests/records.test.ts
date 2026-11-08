import { describe, expect, it } from 'vitest';
import { sortRecords } from '../src/core/records';
import type { GameRecord } from '../src/types/record';

const makeRecord = (id: string, attempts: number, durationMs: number): GameRecord => ({
  id,
  length: 4,
  base: 10,
  attempts,
  durationMs,
  completedAt: '2026-01-01T12:00:00.000Z',
});

describe('sortRecords', () => {
  it('returns an empty list when there are no records', () => {
    expect(sortRecords([])).toEqual([]);
  });

  it('preserves a single record', () => {
    const record = makeRecord('one', 3, 1000);

    expect(sortRecords([record])).toEqual([record]);
  });

  it('sorts by attempts before time', () => {
    const fast = makeRecord('fast', 5, 1000);
    const fewerAttempts = makeRecord('fewer', 2, 9000);
    const middle = makeRecord('middle', 3, 4000);

    expect(sortRecords([fast, fewerAttempts, middle])).toEqual([fewerAttempts, middle, fast]);
  });

  it('uses shorter duration when attempts are equal', () => {
    const slow = makeRecord('slow', 3, 8000);
    const fast = makeRecord('fast', 3, 1000);
    const middle = makeRecord('middle', 3, 4000);

    expect(sortRecords([slow, fast, middle])).toEqual([fast, middle, slow]);
  });

  it('keeps the original order when attempts and time are equal', () => {
    const first = makeRecord('first', 3, 1000);
    const second = makeRecord('second', 3, 1000);

    expect(sortRecords([first, second])).toEqual([first, second]);
  });

  it('does not mutate the original array or records', () => {
    const slow = Object.freeze(makeRecord('slow', 5, 8000));
    const fast = Object.freeze(makeRecord('fast', 2, 1000));
    const records = Object.freeze([slow, fast]);

    const sorted = sortRecords(records);

    expect(sorted).toEqual([fast, slow]);
    expect(sorted).not.toBe(records);
    expect(records).toEqual([slow, fast]);
    expect(slow).toEqual(makeRecord('slow', 5, 8000));
    expect(fast).toEqual(makeRecord('fast', 2, 1000));
  });

  it('returns only the best records for the supplied limit', () => {
    const worst = makeRecord('worst', 8, 1000);
    const best = makeRecord('best', 1, 1000);
    const second = makeRecord('second', 2, 1000);

    expect(sortRecords([worst, best, second], 2)).toEqual([best, second]);
  });

  it('limits the list to ten records by default', () => {
    const records = Array.from({ length: 12 }, (_, index) =>
      makeRecord(String(index), 12 - index, 1000),
    );

    const sorted = sortRecords(records);

    expect(sorted).toHaveLength(10);
    expect(sorted.map((record) => record.attempts)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('returns no records for a zero limit', () => {
    expect(sortRecords([makeRecord('one', 1, 1000)], 0)).toEqual([]);
  });

  it('preserves the settings associated with each record', () => {
    const decimal = makeRecord('decimal', 4, 1000);
    const hex: GameRecord = { ...makeRecord('hex', 2, 2000), length: 6, base: 16 };

    expect(sortRecords([decimal, hex])).toEqual([hex, decimal]);
  });
});
