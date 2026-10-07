/**
 * Site navigation:
 *  - solid header after 80px, driven by an IntersectionObserver on a sentinel (no scroll listener)
 *  - mobile overlay on a native modal <dialog> (focus containment + Esc for free)
 *  - active-section highlight for in-page links (home page only)
 */
const header = document.getElementById('site-header');
const sentinel = document.getElementById('nav-sentinel');

if (header && sentinel) {
  new IntersectionObserver(([entry]) => {
    header.toggleAttribute('data-solid', !entry?.isIntersecting);
  }).observe(sentinel);
}

const dialog = document.getElementById('mobile-menu') as HTMLDialogElement | null;
const opener = document.getElementById('menu-open');

if (dialog && opener) {
  opener.addEventListener('click', () => {
    dialog.showModal();
    opener.setAttribute('aria-expanded', 'true');
  });
  dialog.addEventListener('close', () => opener.setAttribute('aria-expanded', 'false'));
  // One delegated listener: any link or [data-close] inside the overlay closes it.
  dialog.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a, [data-close]')) dialog.close();
  });
  // Leaving the mobile breakpoint with the overlay open should not strand a modal.
  matchMedia('(min-width: 64rem)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}

const sectionLinks = new Map<string, HTMLAnchorElement[]>();
for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-section]')) {
  const id = link.dataset.section!;
  const list = sectionLinks.get(id);
  if (list) list.push(link);
  else sectionLinks.set(id, [link]);
}

const sections = [...sectionLinks.keys()]
  .map((id) => document.getElementById(id))
  .filter((el): el is HTMLElement => el !== null);

if (sections.length) {
  // A thin band across the middle of the viewport decides which section is "current".
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const link of sectionLinks.get(entry.target.id) ?? []) {
          if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-45% 0px -54% 0px' },
  );
  for (const section of sections) observer.observe(section);
}
