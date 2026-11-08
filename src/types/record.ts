import type { NumeralBase } from './game';

export interface GameRecord {
  readonly id: string;
  readonly length: number;
  readonly base: NumeralBase;
  readonly attempts: number;
  readonly durationMs: number;
  readonly completedAt: string;
}
