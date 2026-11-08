export type NumeralBase = 2 | 8 | 10 | 16;

export interface GameSettings {
  readonly length: number;
  readonly base: NumeralBase;
}

export interface Attempt {
  readonly guess: string;
  readonly result: {
    readonly bulls: number;
    readonly cows: number;
  };
}

export interface GameState {
  readonly settings: GameSettings;
  readonly secret: string;
  readonly status: 'playing' | 'won';
  readonly history: readonly Attempt[];
  readonly startedAt: number;
  readonly finishedAt: number | null;
}
