/**
 * Custom cursor accent: a small gold dot that follows the pointer and opens into a ring over
 * interactive elements. Fine pointers only. The pointermove handler just stores coordinates;
 * one rAF loop eases toward them and writes `transform` only (no layout reads). The loop
 * stops itself when the dot settles.
 */
const enabled =
  matchMedia('(hover: hover) and (pointer: fine)').matches && matchMedia('(prefers-reduced-motion: no-preference)').matches;

if (enabled) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor-dot"></span><span class="cursor-ring"></span>';
  document.body.append(cursor);

  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let frame = 0;

  const loop = () => {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
  };

  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!cursor.classList.contains('is-visible')) {
        cx = x;
        cy = y;
        cursor.classList.add('is-visible');
      }
      if (!frame) frame = requestAnimationFrame(loop);
    },
    { passive: true },
  );

  const INTERACTIVE = 'a, button, [role="button"], [role="tab"], select, label, input, textarea, summary';
  document.addEventListener('pointerover', (e) => {
    cursor.classList.toggle('is-hover', Boolean((e.target as Element).closest?.(INTERACTIVE)));
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
}

export {};
