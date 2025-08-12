export default function decorate(block) {
  block.classList.add('pt-enhanced');

  const rows = Array.from(block.children).filter((el) => el.matches(':scope > div'));

  rows.forEach((row) => {
    row.classList.add('timeline-item');
    row.style.position = 'relative'; // for per-row connector

    const cells = Array.from(row.children).filter((el) => el.matches(':scope > div'));
    if (cells.length < 2) return; // guard

    // Detect media cell (has picture/img/video)
    const mediaIdx = cells.findIndex((c) => c.querySelector('picture, img, video'));
    const hasMedia = mediaIdx !== -1;

    let mediaCell;
    let contentCell;

    if (hasMedia) {
      [mediaCell, contentCell] = mediaIdx === 0 ? [cells[0], cells[1]] : [cells[1], cells[0]];
    } else {
      [contentCell, mediaCell] = cells; // fallback
    }

    // Normalize classes
    mediaCell.classList.add('media');
    contentCell.classList.add('content');

    // Wrap media for consistent sizing
    const maybePicture = mediaCell.querySelector('picture, img, video');
    if (maybePicture) {
      const frame = document.createElement('div');
      frame.className = 'media-frame';
      mediaCell.prepend(frame);
      frame.appendChild(maybePicture);
    }

    // Layout side class
    const side = (hasMedia && mediaIdx === 0) ? 'left' : 'right';
    row.dataset.side = side;
    row.classList.add(side);
  });

  block.classList.add('has-spine');
}
