/**
 * Home-page scroll scenes. GSAP + ScrollTrigger are dynamically imported after `load` and an
 * idle callback, so they never compete with first paint. Everything is created inside
 * gsap.matchMedia(), which reverts it automatically if the visitor turns on reduced motion
 * or the viewport crosses the desktop breakpoint. Pages are full navigations (native View
 * Transitions), so there is nothing to leak between pages.
 */
const MOTION = '(prefers-reduced-motion: no-preference)';
const DESKTOP = '(min-width: 64rem)';

async function init() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 1 });

  const willChange = (el: HTMLElement, on: boolean) => (el.style.willChange = on ? 'transform' : '');

  const mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    // Philosophy portrait: drifts at roughly 0.8× scroll speed.
    const parallax = document.querySelector<HTMLElement>('[data-parallax]');
    if (parallax) {
      gsap.fromTo(
        parallax,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: parallax.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onToggle: (self) => willChange(parallax, self.isActive),
          },
        },
      );
    }

    // Tasting timeline: the saffron line draws down as the courses scroll past.
    const line = document.querySelector<SVGLineElement>('[data-draw]');
    const timeline = line?.closest('svg')?.parentElement;
    if (line && timeline) {
      gsap.fromTo(
        line,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 70%', scrub: 0.4 } },
      );
    }
  });

  // Signature dishes: vertical scroll drives the track sideways. Desktop only; mobile keeps native scroll-snap.
  mm.add(`${MOTION} and ${DESKTOP}`, () => {
    const section = document.getElementById('signature');
    const viewport = section?.querySelector<HTMLElement>('[data-track-viewport]');
    const track = section?.querySelector<HTMLElement>('[data-track]');
    if (!section || !viewport || !track) return;

    viewport.classList.add('is-pinned');
    // Measured on refresh only (load/resize), never per frame.
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onToggle: (self) => willChange(track, self.isActive),
      },
    });
    // Keyboard users: tabbing to an off-screen card scrolls the page to where that card is in view.
    const onFocus = (event: FocusEvent) => {
      const card = (event.target as Element).closest<HTMLElement>('li');
      const st = tween.scrollTrigger;
      if (!card || !st) return;
      const progress = Math.min(1, card.offsetLeft / Math.max(1, distance()));
      window.scrollTo({ top: st.start + progress * (st.end - st.start), behavior: 'instant' });
    };
    track.addEventListener('focusin', onFocus);
    return () => {
      track.removeEventListener('focusin', onFocus);
      viewport.classList.remove('is-pinned');
    };
  });

  // Web fonts change text metrics; re-measure once they're in.
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
}

function schedule() {
  if ('requestIdleCallback' in window) requestIdleCallback(() => void init(), { timeout: 2000 });
  else setTimeout(() => void init(), 200);
}

if (matchMedia(MOTION).matches) {
  if (document.readyState === 'complete') schedule();
  else addEventListener('load', schedule, { once: true });
}

export {};
