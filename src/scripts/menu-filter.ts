/**
 * Menu tabs + filters. All items are static HTML; nothing is fetched.
 *
 *  - One O(n) pass on load groups item elements by tab: Map<TabId, Item[]>.
 *  - Tab switch: O(1) Map lookup, toggle one panel. Filtering only touches the active tab's k items,
 *    and is skipped entirely when that tab was already filtered with the same settings.
 *  - Filter test per item: (mask & diet) === diet && spice <= maxSpice  (diet is a bitmask).
 *  - All DOM writes are batched into one requestAnimationFrame.
 *  - State lives in the URL (?tab=…&diet=…&spice=…) via history.replaceState.
 */
import type { Category, TabId } from '../types';

interface Item {
  el: HTMLElement;
  mask: number;
  spice: number;
  section: HTMLElement;
}

const CATEGORY_TAB: Record<Category, TabId> = {
  starters: 'a-la-carte',
  mains: 'a-la-carte',
  breads: 'a-la-carte',
  desserts: 'desserts',
  drinks: 'drinks',
};
const MAX_SPICE = 3;

const root = document.querySelector<HTMLElement>('[data-menu]');

if (root) {
  const tablist = root.querySelector<HTMLElement>('[data-tablist]')!;
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = new Map<TabId, HTMLElement>();
  for (const panel of root.querySelectorAll<HTMLElement>('[data-panel]')) panels.set(panel.dataset.panel as TabId, panel);
  const filters = root.querySelector<HTMLElement>('[data-filters]')!;
  const chips = [...filters.querySelectorAll<HTMLButtonElement>('[data-diet]')];
  const spiceSelect = filters.querySelector<HTMLSelectElement>('[data-spice-max]')!;
  const count = filters.querySelector<HTMLElement>('[data-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const panelsTop = root.querySelector<HTMLElement>('[data-panels]')!;

  // ---- One O(n) grouping pass; data attributes are parsed exactly once. ----
  const groups = new Map<TabId, Item[]>();
  const sections = new Map<TabId, HTMLElement[]>();
  for (const el of root.querySelectorAll<HTMLElement>('[data-diet-mask]')) {
    const tab = CATEGORY_TAB[el.dataset.category as Category];
    const section = el.closest<HTMLElement>('[data-section]')!;
    const list = groups.get(tab) ?? groups.set(tab, []).get(tab)!;
    list.push({ el, mask: Number(el.dataset.dietMask), spice: Number(el.dataset.spice), section });
    const secs = sections.get(tab) ?? sections.set(tab, []).get(tab)!;
    if (secs.at(-1) !== section) secs.push(section);
  }

  const isTab = (v: string | null): v is TabId => v !== null && panels.has(v as TabId);
  const clampInt = (v: string | null, min: number, max: number, fallback: number) => {
    const n = v === null ? NaN : Number.parseInt(v, 10);
    return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
  };

  // ---- State, restored from the URL. `?tab=` also accepts a category, e.g. ?tab=mains. ----
  const params = new URLSearchParams(location.search);
  const rawTab = params.get('tab');
  const defaultTab = root.dataset.defaultTab as TabId;
  const state = {
    tab: isTab(rawTab) ? rawTab : rawTab && rawTab in CATEGORY_TAB ? CATEGORY_TAB[rawTab as Category] : defaultTab,
    diet: clampInt(params.get('diet'), 0, 7, 0),
    spice: clampInt(params.get('spice'), 0, MAX_SPICE, MAX_SPICE),
  };
  let scrollTarget: HTMLElement | null =
    (location.hash && document.getElementById(location.hash.slice(1))) ||
    (rawTab && !isTab(rawTab) ? document.getElementById(`section-${rawTab}`) : null);

  let shownTab: TabId | null = defaultTab;
  const applied = new Map<TabId, string>();
  let frame = 0;

  const render = () => {
    frame = 0;
    const { tab, diet, spice } = state;

    // Tabs and panels: constant work.
    for (const t of tabs) {
      const on = t.dataset.tab === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    }
    if (shownTab !== tab) {
      if (shownTab) panels.get(shownTab)?.removeAttribute('data-active');
      panels.get(tab)?.setAttribute('data-active', '');
      shownTab = tab;
    }

    for (const chip of chips) chip.setAttribute('aria-pressed', String((diet & Number(chip.dataset.diet)) !== 0));
    spiceSelect.value = String(spice);

    // Filtering: only the active tab's items, and only if its filter key changed.
    const items = groups.get(tab);
    filters.hidden = !items;
    if (items) {
      const key = `${diet}:${spice}`;
      let visible = 0;
      if (applied.get(tab) !== key) {
        const perSection = new Map<HTMLElement, number>();
        for (const item of items) {
          const show = (item.mask & diet) === diet && item.spice <= spice;
          item.el.hidden = !show;
          if (show) {
            visible++;
            perSection.set(item.section, (perSection.get(item.section) ?? 0) + 1);
          }
        }
        for (const section of sections.get(tab)!) section.hidden = !perSection.has(section);
        applied.set(tab, key);
        panels.get(tab)!.dataset.visible = String(visible);
      } else {
        visible = Number(panels.get(tab)!.dataset.visible);
      }
      count.textContent = `${visible} ${visible === 1 ? 'dish' : 'dishes'}`;
      empty.hidden = visible > 0;
    } else {
      empty.hidden = true;
    }

    // URL: only non-default values, so shared links stay short.
    const next = new URLSearchParams();
    if (tab !== defaultTab) next.set('tab', tab);
    if (diet) next.set('diet', String(diet));
    if (spice !== MAX_SPICE) next.set('spice', String(spice));
    const query = next.toString();
    // The deep-link #hash is honoured once on load, then dropped so it doesn't follow the reader around.
    history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}`);

    if (scrollTarget) {
      scrollTarget.scrollIntoView({ block: 'start' });
      scrollTarget = null;
    }
  };

  const update = (patch: Partial<typeof state>) => {
    Object.assign(state, patch);
    if (!frame) frame = requestAnimationFrame(render);
  };

  const selectTab = (tab: TabId, focus = false) => {
    if (focus) tabs.find((t) => t.dataset.tab === tab)?.focus();
    // If the reader has scrolled deep into a long panel, bring the new one into view (one read, before writes).
    if (tab !== state.tab && panelsTop.getBoundingClientRect().top < 0) scrollTarget = panelsTop;
    update({ tab });
  };

  // ---- Delegated listeners ----
  root.addEventListener('click', (event) => {
    const target = event.target as Element;
    const tab = target.closest<HTMLElement>('[role="tab"]');
    if (tab) return selectTab(tab.dataset.tab as TabId);
    const chip = target.closest<HTMLElement>('[data-diet]');
    if (chip) return update({ diet: state.diet ^ Number(chip.dataset.diet) });
    if (target.closest('[data-action="clear"]')) update({ diet: 0, spice: MAX_SPICE });
  });

  spiceSelect.addEventListener('change', () => update({ spice: Number(spiceSelect.value) }));

  // Arrow keys / Home / End with roving tabindex (automatic activation).
  tablist.addEventListener('keydown', (event) => {
    const i = tabs.findIndex((t) => t.dataset.tab === state.tab);
    const last = tabs.length - 1;
    const to = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    selectTab(tabs[to]!.dataset.tab as TabId, true);
  });

  // First paint reflects the URL state immediately (no flash of the default tab); later updates batch per frame.
  render();
}
