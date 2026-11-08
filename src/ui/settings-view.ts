import { countPossibleSecrets } from '../core/count-possible-secrets';
import type { GameSettings, NumeralBase } from '../types/game';

export const createSettingsView = (onStart: (settings: GameSettings) => void): HTMLFormElement => {
  const form = document.createElement('form');
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'Round settings';

  const baseLabel = document.createElement('label');
  baseLabel.textContent = 'Number system ';
  const baseSelect = document.createElement('select');
  baseSelect.name = 'base';

  const bases: readonly NumeralBase[] = [2, 8, 10, 16];
  const names = ['Binary (bin)', 'Octal (oct)', 'Decimal (dec)', 'Hexadecimal (hex)'];

  bases.forEach((base, index) => {
    const option = document.createElement('option');
    option.value = String(base);
    option.textContent = names[index];
    baseSelect.append(option);
  });
  baseSelect.value = '10';
  baseLabel.append(baseSelect);

  const lengthLabel = document.createElement('label');
  lengthLabel.textContent = 'Secret length ';
  const lengthSelect = document.createElement('select');
  lengthSelect.name = 'length';

  for (let length = 2; length <= 6; length += 1) {
    const option = document.createElement('option');
    option.value = String(length);
    option.textContent = String(length);
    lengthSelect.append(option);
  }
  lengthSelect.value = '4';
  lengthLabel.append(lengthSelect);

  const possibleSecrets = document.createElement('p');
  possibleSecrets.setAttribute('aria-live', 'polite');

  const startButton = document.createElement('button');
  startButton.type = 'submit';
  startButton.textContent = 'Start game';

  const getSettings = (): GameSettings => ({
    length: Number(lengthSelect.value),
    base: bases.find((base) => base === Number(baseSelect.value)) ?? 10,
  });

  const updateSettings = (): void => {
    const { base } = getSettings();

    for (const option of lengthSelect.options) {
      option.disabled = Number(option.value) > base;
    }
    if (Number(lengthSelect.value) > base) lengthSelect.value = '2';

    const { length } = getSettings();
    possibleSecrets.textContent = `Possible secrets: ${countPossibleSecrets(length, base).toLocaleString('en-US')}`;
  };

  baseSelect.addEventListener('change', updateSettings);
  lengthSelect.addEventListener('change', updateSettings);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (fieldset.disabled) return;

    fieldset.disabled = true;
    onStart(getSettings());
  });

  fieldset.append(legend, baseLabel, lengthLabel, possibleSecrets, startButton);
  form.append(fieldset);
  updateSettings();
  return form;
};
