import { createGame } from './core/game-state';
import { generateSecret } from './core/generate-secret';
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

const showSettings = (): void => {
  gameContainer.replaceChildren();
  status.textContent = '';

  const settingsView = createSettingsView((settings) => {
    const secret = generateSecret(settings.length, settings.base);
    const state = createGame(settings, secret, Date.now());

    status.textContent = `Round started: ${settings.length} unique digits in base ${settings.base}.`;
    gameContainer.replaceChildren(createGameView(state, showSettings));
    gameContainer.querySelector('input')?.focus();
  });

  settingsContainer.replaceChildren(settingsView);
  settingsContainer.querySelector('select')?.focus();
};

main.append(heading, description, settingsContainer, status, gameContainer);
document.body.append(main);
showSettings();
