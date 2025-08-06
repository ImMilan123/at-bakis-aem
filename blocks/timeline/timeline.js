export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'timeline-wrapper';

  [...block.children].forEach((row) => {
    const cols = row.children;
    if (cols.length !== 2) return; // Skip malformed rows

    const imageCell = cols[0].querySelector('img') ? cols[0] : cols[1];
    const textCell = cols[0].querySelector('img') ? cols[1] : cols[0];
    const image = imageCell.querySelector('img');

    if (!image) return;

    const item = document.createElement('div');
    item.className = `timeline-item ${imageCell === cols[0] ? 'left' : 'right'}`;

    const content = document.createElement('div');
    content.className = 'timeline-content';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'timeline-image';
    imageWrapper.appendChild(image.cloneNode(true));

    const connector = document.createElement('div');
    connector.className = 'timeline-connector';

    const textWrapper = document.createElement('div');
    textWrapper.className = 'timeline-text';
    [...textCell.childNodes].forEach((node) => {
      textWrapper.appendChild(node.cloneNode(true));
    });

    content.appendChild(imageWrapper);
    content.appendChild(connector);
    content.appendChild(textWrapper);

    item.appendChild(content);
    wrapper.appendChild(item);
  });

  block.innerHTML = '';
  block.appendChild(wrapper);
  block.classList.add('custom-timeline');
}
