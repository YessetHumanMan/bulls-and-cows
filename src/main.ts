import { createSettingsView } from './ui/settings-view';

const main = document.createElement('main');
const heading = document.createElement('h1');
heading.textContent = 'Bulls and Cows';

const description = document.createElement('p');
description.textContent =
  'Guess the secret: a bull is a correct digit in place, a cow is a digit out of place.';

const status = document.createElement('p');
status.setAttribute('role', 'status');

const settingsView = createSettingsView(({ length, base }) => {
  status.textContent = `Round started: ${length} unique digits in base ${base}.`;
});

main.append(heading, description, settingsView, status);
document.body.append(main);
