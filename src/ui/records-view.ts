import type { GameRecord } from '../types/record';

export const createRecordsView = (records: readonly GameRecord[]): HTMLElement => {
  const section = document.createElement('section');
  const heading = document.createElement('h2');
  heading.textContent = 'Top 10 records';
  section.append(heading);

  if (records.length === 0) {
    const hint = document.createElement('p');
    hint.textContent = 'Win a round to set your first record.';
    section.append(hint);
    return section;
  }

  const table = document.createElement('table');
  const caption = document.createElement('caption');
  caption.textContent = 'Best results by attempts, then time. All round settings are included.';
  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');

  ['Rank', 'Length', 'Base', 'Attempts', 'Time (s)'].forEach((title) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = title;
    headerRow.append(cell);
  });
  head.append(headerRow);

  const body = document.createElement('tbody');
  records.forEach((record, index) => {
    const row = document.createElement('tr');
    const values = [
      index + 1,
      record.length,
      record.base,
      record.attempts,
      (record.durationMs / 1000).toFixed(1),
    ];

    values.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.append(cell);
    });
    body.append(row);
  });

  table.append(caption, head, body);
  section.append(table);
  return section;
};
