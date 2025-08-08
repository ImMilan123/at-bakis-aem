/**
 * Timeline block (AEM Franklin)
 * Doc expects a 2-column table per row: one side image (picture/img), the other side text.
 * Layout keeps the side you used in the doc. No innerHTML used—nodes are moved.
 */
export default function decorate(block) {
  // scope class in case your block class is only the folder name
  block.classList.add('timeline');

  // turn each table row into .timeline-row with .media and .content
  [...block.children].forEach((row) => {
    row.classList.add('timeline-row');

    const cells = [...row.children];
    const leftHasImg = !!cells[0].querySelector('picture, img');
    const mediaCell = leftHasImg ? cells[0] : cells[1];
    const textCell = leftHasImg ? cells[1] : cells[0];

    row.classList.add(leftHasImg ? 'left' : 'right');

    const media = document.createElement('div');
    media.className = 'media';

    const pic = mediaCell.querySelector('picture, img');
    if (pic) media.append(pic);

    const img = media.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = img.alt || '';
      img.style.objectFit = 'cover';
    }

    const content = document.createElement('div');
    content.className = 'content';
    [...textCell.childNodes].forEach((n) => content.append(n));

    row.textContent = '';
    row.append(media, content);
  });

  // center vertical axis
  const axis = document.createElement('div');
  axis.className = 'axis';
  block.prepend(axis);

  function computeConnectors() {
    // hide connectors entirely when stacked
    const stacked = block.classList.contains('stack');
    const blockRect = block.getBoundingClientRect();
    const axisX = blockRect.left + blockRect.width / 2;

    block.querySelectorAll('.timeline-row').forEach((row) => {
      const media = row.querySelector('.media');
      const mrect = media.getBoundingClientRect();

      // ~half of image width into the paragraph
      const penetration = Math.round(mrect.width * 0.5);

      let connector = 0;
      if (!stacked) {
        if (row.classList.contains('left')) {
          connector = Math.max(0, Math.round(axisX - mrect.right + penetration));
        } else {
          connector = Math.max(0, Math.round(mrect.left - axisX + penetration));
        }
      }

      media.style.setProperty('--connector', `${connector}px`);
      media.style.setProperty('--penetration', `${penetration}px`);
    });
  }

  // collapse to single column if a row can't fit
  function maybeStack() {
    let shouldStack = false;

    const rows = block.querySelectorAll('.timeline-row');
    rows.forEach((row) => {
      const media = row.querySelector('.media');
      const content = row.querySelector('.content');

      // actual widths + the CSS column-gap
      const cs = window.getComputedStyle(row);
      const gap = parseFloat(cs.columnGap) || 0;

      const needed = media.offsetWidth + content.offsetWidth + gap;
      const available = block.clientWidth - 8; // small safety margin

      if (needed > available) shouldStack = true;
    });

    block.classList.toggle('stack', shouldStack);
  }

  function recalc() {
    maybeStack();
    computeConnectors();
  }

  // wait for images then compute; recompute on resize
  const imgs = [...block.querySelectorAll('img')];
  if (imgs.length === 0) {
    recalc();
  } else {
    let pending = imgs.length;
    const done = () => {
      pending -= 1;
      if (pending === 0) recalc();
    };
    imgs.forEach((im) => {
      if (im.complete) done();
      else {
        im.addEventListener('load', done, { once: true });
        im.addEventListener('error', done, { once: true });
      }
    });
  }

  window.addEventListener('resize', recalc);
}
