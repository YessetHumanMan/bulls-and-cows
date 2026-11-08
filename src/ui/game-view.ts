import { createDigitValidator } from '../core/digit-validator';
import { submitGuess } from '../core/game-state';
import { isValidGuess } from '../core/validate-guess';
import type { GameState } from '../types/game';
import { createHistoryEntry } from './history-view';

export const createGameView = (
  initialState: GameState,
  onNewGame: () => void,
  onWin: (state: GameState) => void,
): HTMLElement => {
  let state = initialState;
  const { length, base } = state.settings;
  const isValidDigit = createDigitValidator(base);

  const section = document.createElement('section');
  section.className = 'game-view';
  const heading = document.createElement('h2');
  heading.textContent = 'Your guess';

  const form = document.createElement('form');
  form.className = 'guess-form';
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = `Enter ${length} unique digits in base ${base}`;

  const label = document.createElement('label');
  label.textContent = 'Guess ';
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'guess';
  input.maxLength = length;
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.inputMode = base === 16 ? 'text' : 'numeric';
  label.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Check guess';

  const message = document.createElement('p');
  message.setAttribute('role', 'status');

  const historyHeading = document.createElement('h2');
  historyHeading.textContent = 'Attempts (0)';
  const history = document.createElement('ol');
  history.className = 'attempts-list';

  const newGameButton = document.createElement('button');
  newGameButton.type = 'button';
  newGameButton.className = 'secondary-button';
  newGameButton.textContent = 'New game';
  newGameButton.addEventListener('click', onNewGame);

  input.addEventListener('beforeinput', (event) => {
    if (event.isComposing || !event.data) return;
    if (![...event.data].every(isValidDigit)) event.preventDefault();
  });

  input.addEventListener('input', () => {
    input.value = [...input.value].filter(isValidDigit).slice(0, length).join('').toLowerCase();
    message.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.status !== 'playing') return;

    const guess = input.value.toLowerCase();
    if (!isValidGuess(guess, length, base)) {
      message.textContent = `Enter exactly ${length} unique digits in base ${base}.`;
      return;
    }

    const nextState = submitGuess(state, guess, Date.now());
    if (nextState === state) {
      message.textContent = 'You have already tried this guess.';
      return;
    }

    state = nextState;
    const attempt = state.history[state.history.length - 1];
    history.append(createHistoryEntry(attempt));
    historyHeading.textContent = `Attempts (${state.history.length})`;
    input.value = '';
    message.textContent = `Bulls: ${attempt.result.bulls}, cows: ${attempt.result.cows}`;

    fieldset.disabled = state.status === 'won';
    if (state.finishedAt !== null) {
      const seconds = ((state.finishedAt - state.startedAt) / 1000).toFixed(1);
      message.textContent = `You won! Secret: ${state.secret}. Attempts: ${state.history.length}. Time: ${seconds} seconds.`;
      newGameButton.focus();
      onWin(state);
    } else {
      input.focus();
    }
  });

  fieldset.append(legend, label, button);
  form.append(fieldset, message);
  section.append(heading, form, newGameButton, historyHeading, history);
  return section;
};
