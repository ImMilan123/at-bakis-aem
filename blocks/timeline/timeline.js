/**
 * Decorates the timeline block.
 * @param {Element} block The timeline block element.
 */
export default function decorate(block) {
  // Add the main 'timeline' class to the block for styling
  block.classList.add('timeline');

  // Get all the rows from the authored table
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    // Add a class to each row to identify it as a timeline item
    row.classList.add('timeline-item');

    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length !== 2) {
      console.warn('Timeline block item should have exactly two columns: one for content, one for image.', row);
      return;
    }

    // Automatically detect which cell contains the image vs. the text content.
    // This makes authoring more flexible.
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const contentCell = cells.find((cell) => !cell.querySelector('picture'));

    // If detection fails for any reason, fall back to the original column order.
    if (!imageCell || !contentCell) {
      cells[0].classList.add('timeline-content');
      cells[1].classList.add('timeline-image');
    } else {
      contentCell.classList.add('timeline-content');
      imageCell.classList.add('timeline-image');

      // Enforce a consistent DOM order (content first, then image)
      // This ensures the CSS for the zigzag effect works reliably.
      row.innerHTML = '';
      row.append(contentCell, imageCell);
    }

    // Find the content cell again after potential reordering
    const finalContentCell = row.querySelector('.timeline-content');

    // To style the year/date differently, we'll find the first 'strong' element
    // which we assume is the year, and wrap it in an H3 tag.
    const yearElement = finalContentCell.querySelector('strong');
    if (yearElement) {
      const h3 = document.createElement('h3');
      h3.textContent = yearElement.textContent;

      // If the year is inside a paragraph, replace the paragraph with the new H3.
      // Otherwise, prepend the H3 to the content cell.
      if (yearElement.parentElement.tagName === 'P') {
        yearElement.parentElement.replaceWith(h3);
      } else {
        yearElement.remove();
        finalContentCell.prepend(h3);
      }
    }
  });
}
