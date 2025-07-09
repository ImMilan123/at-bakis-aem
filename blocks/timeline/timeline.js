export default function decorate(block) {
  const rows = Array.from(block.querySelectorAll('div'));

  rows.forEach((row, index) => {
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length === 2) {
      const rowEl = document.createElement('div');
      rowEl.classList.add('timeline-row');

      const col1 = document.createElement('div');
      const col2 = document.createElement('div');

      if (index % 2 === 0) {
        col1.className = 'timeline-image';
        col2.className = 'timeline-text';
      } else {
        col1.className = 'timeline-text';
        col2.className = 'timeline-image';
      }

      col1.innerHTML = cols[0].innerHTML;
      col2.innerHTML = cols[1].innerHTML;

      rowEl.append(col1, col2);
      row.replaceWith(rowEl);
    }
  });

  block.classList.add('timeline');
}
