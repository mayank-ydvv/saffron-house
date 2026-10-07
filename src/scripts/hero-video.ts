/**
 * Hero background video. Loaded only after the page `load` event, and only when the visitor
 * isn't saving data, isn't on 2G and hasn't asked for reduced motion. The poster stays the LCP.
 */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
const toggle = document.querySelector<HTMLButtonElement>('[data-video-toggle]');

function shouldLoad(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '')) return false;
  return matchMedia('(prefers-reduced-motion: no-preference)').matches;
}

function start(el: HTMLVideoElement, button: HTMLButtonElement) {
  for (const [src, type] of [
    ['/video/hero.webm', 'video/webm'],
    ['/video/hero.mp4', 'video/mp4'],
  ] as const) {
    const source = document.createElement('source');
    source.src = src;
    source.type = type;
    el.append(source);
  }

  let userPaused = false;
  const label = button.querySelector('[data-label]')!;
  const sync = () => {
    const paused = el.paused;
    button.querySelector('[data-icon="pause"]')!.classList.toggle('hidden', paused);
    button.querySelector('[data-icon="play"]')!.classList.toggle('hidden', !paused);
    label.textContent = paused ? 'Play background video' : 'Pause background video';
  };

  el.addEventListener(
    'playing',
    () => {
      el.classList.add('is-playing');
      button.hidden = false;
    },
    { once: true },
  );
  el.addEventListener('play', sync);
  el.addEventListener('pause', sync);

  button.addEventListener('click', () => {
    userPaused = !el.paused;
    if (userPaused) el.pause();
    else void el.play();
  });

  // Don't decode frames nobody can see.
  new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) el.pause();
    else if (!userPaused) el.play().catch(() => {});
  }).observe(el);
}

if (video && toggle && shouldLoad()) {
  if (document.readyState === 'complete') start(video, toggle);
  else addEventListener('load', () => start(video, toggle), { once: true });
}

export {};
