/**
 * Regions map: ONE delegated listener set on the component handles every region
 * (SVG paths and the chip buttons). Region data is an O(1) keyed lookup.
 */
import regionsJson from '../data/regions.json';
import type { RegionId, Regions } from '../types';

const regions = regionsJson as Regions;
const root = document.querySelector<HTMLElement>('[data-region-map]');

if (root) {
  const fields = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-field]')].map((el) => [el.dataset.field as keyof Regions[RegionId], el]),
  );
  const controls = [...root.querySelectorAll<Element>('[data-region]')];
  let current = root.querySelector<Element>('[data-region][data-active]')?.getAttribute('data-region') as RegionId | null;

  const select = (id: RegionId) => {
    if (id === current) return;
    current = id;
    const region = regions[id];
    for (const [key, el] of fields) el.textContent = region[key];
    for (const el of controls) {
      const on = el.getAttribute('data-region') === id;
      el.setAttribute('aria-pressed', String(on));
      el.toggleAttribute('data-active', on);
    }
  };

  const regionOf = (target: EventTarget | null) =>
    (target as Element | null)?.closest?.('[data-region]')?.getAttribute('data-region') as RegionId | undefined;

  const activate = (event: Event) => {
    const id = regionOf(event.target);
    if (id && id in regions) select(id);
  };

  // Hover previews only for a mouse on the map itself; touch relies on click.
  root.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'mouse' && (e.target as Element).matches('path[data-region]')) activate(e);
  });
  root.addEventListener('focusin', activate);
  root.addEventListener('click', activate);
  // SVG paths with role="button" need Enter/Space wired by hand (real <button>s get it free).
  root.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && (e.target as Element).matches('path[data-region]')) {
      e.preventDefault();
      activate(e);
    }
  });
}
