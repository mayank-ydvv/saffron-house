/**
 * Section reveals: ONE shared IntersectionObserver for the whole page.
 * It only adds `.is-visible`; CSS owns the fade-up (and skips it under reduced motion).
 */
const targets = document.querySelectorAll<HTMLElement>('.reveal');

if (targets.length && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.2 },
  );
  for (const el of targets) observer.observe(el);
}

export {};
