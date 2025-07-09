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

    // Each row from the document becomes a div, and each cell within that row is another div.
    // We expect two cells: one for content, one for the image.
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length !== 2) {
      console.warn('Timeline block item should have exactly two columns: one for content, one for image.', row);
      return;
    }

    const contentCell = cells[0];
    const imageCell = cells[1];

    contentCell.classList.add('timeline-content');
    imageCell.classList.add('timeline-image');

    // To style the year/date differently, we'll find the first 'strong' element
    // which we assume is the year, and wrap it in an H3 tag.
    const yearElement = contentCell.querySelector('strong');
    if (yearElement) {
      const year = yearElement.textContent;
      const h3 = document.createElement('h3');
      h3.textContent = year;

      // If the year is inside a paragraph, replace the paragraph with the new H3.
      // Otherwise, prepend the H3 to the content cell.
      if (yearElement.parentElement.tagName === 'P') {
        yearElement.parentElement.replaceWith(h3);
      } else {
        yearElement.remove();
        contentCell.prepend(h3);
      }
    }
  });
}
