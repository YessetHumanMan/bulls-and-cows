import { createGame } from './core/game-state';
import { generateSecret } from './core/generate-secret';
import { sortRecords } from './core/records';
import { loadRecords, saveRecords } from './storage/records-storage';
import type { GameState } from './types/game';
import type { GameRecord } from './types/record';
import { createRecordsView } from './ui/records-view';
import { createGameView } from './ui/game-view';
import { createSettingsView } from './ui/settings-view';

const main = document.createElement('main');
const heading = document.createElement('h1');
heading.textContent = 'Bulls and Cows';

const description = document.createElement('p');
description.textContent =
  'Guess the secret: a bull is a correct digit in place, a cow is a digit out of place.';

const status = document.createElement('p');
status.setAttribute('role', 'status');

const settingsContainer = document.createElement('div');
const gameContainer = document.createElement('div');
const recordsContainer = document.createElement('div');
const storageMessage = document.createElement('p');
storageMessage.setAttribute('role', 'status');
let records = loadRecords();
recordsContainer.append(createRecordsView(records));

const handleWin = (state: GameState): void => {
  if (state.finishedAt === null) return;

  const record: GameRecord = {
    id: crypto.randomUUID(),
    length: state.settings.length,
    base: state.settings.base,
    attempts: state.history.length,
    durationMs: state.finishedAt - state.startedAt,
    completedAt: new Date(state.finishedAt).toISOString(),
  };

  records = sortRecords([...records, record]);
  const saved = saveRecords(records);
  storageMessage.textContent = saved
    ? ''
    : 'Records are available for this session, but could not be saved.';
  recordsContainer.replaceChildren(createRecordsView(records));
};

const showSettings = (): void => {
  gameContainer.replaceChildren();
  status.textContent = '';

  const settingsView = createSettingsView((settings) => {
    const secret = generateSecret(settings.length, settings.base);
    const state = createGame(settings, secret, Date.now());

    status.textContent = `Round started: ${settings.length} unique digits in base ${settings.base}.`;
    gameContainer.replaceChildren(createGameView(state, showSettings, handleWin));
    gameContainer.querySelector('input')?.focus();
  });

  settingsContainer.replaceChildren(settingsView);
  settingsContainer.querySelector('select')?.focus();
};

main.append(
  heading,
  description,
  settingsContainer,
  status,
  gameContainer,
  recordsContainer,
  storageMessage,
);
document.body.append(main);
showSettings();
