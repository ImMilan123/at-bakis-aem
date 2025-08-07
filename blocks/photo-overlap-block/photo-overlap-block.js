export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    row.classList.add('timeline-row');

    const cols = [...row.children];
    const imageCol = cols.find((col) => col.querySelector('img'));
    const textCol = cols.find((col) => !col.querySelector('img'));

    if (index % 2 === 0) {
      row.classList.add('left-image');
    } else {
      row.classList.add('right-image');
    }

    // Wrap image and text in dedicated containers
    if (imageCol) imageCol.classList.add('timeline-image');
    if (textCol) textCol.classList.add('timeline-text');
  });
}
