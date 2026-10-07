/**
 * Testimonials carousel. Slow auto-rotation that pauses on hover, focus, hidden tab or by the
 * visitor's choice. Never autoplays with reduced motion. One delegated click listener.
 */
const root = document.querySelector<HTMLElement>('[data-carousel]');

if (root) {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const live = root.querySelector<HTMLElement>('[data-live]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-action="toggle"]')!;
  const INTERVAL = 7000;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let timer = 0;
  let userPaused = reduced;
  let hovering = false;
  let focused = false;

  const show = (i: number) => {
    slides[index]!.removeAttribute('data-active');
    slides[index]!.setAttribute('aria-hidden', 'true');
    slides[index]!.inert = true;
    index = (i + slides.length) % slides.length;
    slides[index]!.setAttribute('data-active', '');
    slides[index]!.removeAttribute('aria-hidden');
    slides[index]!.inert = false;
  };

  const sync = () => {
    clearInterval(timer);
    const running = !userPaused && !hovering && !focused && !document.hidden;
    if (running) timer = window.setInterval(() => show(index + 1), INTERVAL);
    // Announce slide changes only when the visitor is driving them.
    live.setAttribute('aria-live', running ? 'off' : 'polite');
    toggle.querySelector('[data-icon="pause"]')!.classList.toggle('hidden', userPaused);
    toggle.querySelector('[data-icon="play"]')!.classList.toggle('hidden', !userPaused);
    toggle.querySelector('[data-label]')!.textContent = userPaused ? 'Start rotation' : 'Pause rotation';
  };

  root.addEventListener('click', (event) => {
    const action = (event.target as Element).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'prev') show(index - 1);
    else if (action === 'next') show(index + 1);
    else if (action === 'toggle') userPaused = !userPaused;
    else return;
    sync();
  });
  root.addEventListener('pointerenter', () => ((hovering = true), sync()));
  root.addEventListener('pointerleave', () => ((hovering = false), sync()));
  root.addEventListener('focusin', () => ((focused = true), sync()));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node | null)) (focused = false), sync();
  });
  document.addEventListener('visibilitychange', sync);

  if (!reduced) toggle.hidden = false;
  sync();
}

export {};
