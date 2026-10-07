/**
 * Gallery lightbox on a native modal <dialog>.
 * One delegated click listener on the grid; full-size images are requested only when shown.
 */
const grid = document.querySelector<HTMLElement>('[data-gallery]');
const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;

if (grid && dialog) {
  const buttons = [...grid.querySelectorAll<HTMLButtonElement>('button[data-full]')];
  const image = dialog.querySelector<HTMLImageElement>('[data-image]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-counter]')!;
  let index = 0;
  let opener: HTMLButtonElement | null = null;

  const show = (i: number) => {
    index = (i + buttons.length) % buttons.length;
    const button = buttons[index]!;
    const alt = button.querySelector('img')?.alt ?? '';
    image.src = button.dataset.full!;
    image.width = Number(button.dataset.width);
    image.height = Number(button.dataset.height);
    image.alt = alt;
    caption.textContent = alt;
    counter.textContent = `${index + 1} / ${buttons.length}`;
  };

  grid.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-full]');
    if (!button) return;
    opener = button;
    show(buttons.indexOf(button));
    dialog.showModal();
  });

  dialog.addEventListener('click', (event) => {
    const action = (event.target as Element).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'prev') show(index - 1);
    else if (action === 'next') show(index + 1);
    else if (action === 'close' || event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    else if (event.key === 'ArrowRight') show(index + 1);
    else return;
    event.preventDefault();
  });

  // Esc is handled natively by <dialog>; return focus to the thumbnail that opened it.
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    opener?.focus();
  });
}

export {};
