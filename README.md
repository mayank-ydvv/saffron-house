# Saffron House

A concept website for a **fictional** Indian fine-dining restaurant in Chennai. It's a portfolio piece built to show design taste, clean front-end architecture and near-perfect performance.

> Concept project — not a real restaurant. Every name, address, phone number, review and publication is invented.

## Tech stack

- **Astro 7**: static output, with no UI framework and no hydration
- **Tailwind CSS 4**: design tokens live in `@theme` in `src/styles/global.css`
- **Vanilla TypeScript**, strict mode, for all interactivity
- **GSAP + ScrollTrigger**: dynamically imported on the home page only, after `load` + idle
- **Astro `<Image />` / `<Picture />`**: AVIF/WebP with responsive `srcset` at 480/960/1600
- **Fontsource**: self-hosted Cormorant Garamond (500, 600) and Inter (400, 500), Latin subset
- **@lucide/astro**: icons rendered to inline SVG at build time, so they ship no JS
- **@astrojs/sitemap**, plus `robots.txt` and `Restaurant` JSON-LD
- **Native cross-document View Transitions** (CSS only, 0 KB JS)
- Deploys as a static site to **Vercel**

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run check      # astro check (TypeScript + Astro diagnostics)
npm run assets     # regenerate placeholder images / OG card / IMAGES.md (never overwrites)
```

Requires Node 22.12 or newer.

## Folder structure

```
saffron-house/
├── public/                  favicon.svg, og.jpg, robots.txt, (video/hero.mp4|webm)
├── src/
│   ├── assets/images/       photos (generated placeholders until replaced)
│   ├── components/          Nav, Hero, Philosophy, SignatureDishes, TastingTimeline, RegionMap,
│   │                        ChefSection, Gallery, Testimonials, ReserveCTA, Location, MenuItem,
│   │                        Footer, Button, Logo, SectionHeading, SpiceLevel, DietIcons
│   ├── data/                menu.json, tasting.json, regions.json, testimonials.json,
│   │                        gallery.json, site.ts, content.ts   ← all copy lives here
│   ├── layouts/Base.astro   <head>, SEO, JSON-LD, skip link, nav, footer
│   ├── lib/                 data.ts (typed + validated loaders), diet.ts, format.ts,
│   │                        images.ts, slots.ts
│   ├── pages/               index, menu, reserve, about, 404
│   ├── scripts/             nav, reveal, cursor, animations, hero-video, regions, lightbox,
│   │                        carousel, newsletter, menu-filter, reserve-form
│   ├── styles/global.css
│   └── types.ts
├── tools/generate-assets.mjs
├── IMAGES.md                every image the site needs, with sizes and search terms
├── astro.config.mjs
└── vercel.json
```

## Features

- **Home**: a long-scroll story with 12 sections.
  - The hero has an optional background video (with a pause control) and a build-time word-split headline.
  - Story portrait with parallax.
  - Signature dishes pin and scroll sideways on desktop, and use native scroll-snap on mobile.
  - The tasting timeline draws its line on scroll.
  - Interactive region map.
  - Chef feature.
  - Masonry gallery with a `<dialog>` lightbox.
  - Testimonials carousel with pause controls.
  - Reservation call-to-action.
  - OpenStreetMap embed with hours.
  - Footer newsletter form.
- **Menu**: an accessible tablist (arrow keys, Home/End, roving tabindex).
  - Vegetarian / vegan / gluten-free filters and a spice ceiling.
  - Filter state lives in the URL (`?tab=a-la-carte&diet=5&spice=2`; `?tab=mains#awadhi-nihari` also works).
  - Empty state when nothing matches.
- **Reserve**: native validation, then business rules (closed Mondays, a 60-day window, same-day lead time).
  - Errors appear inline with `aria-invalid` / `aria-describedby`, and focus moves to the first invalid field.
  - A confirmation panel replaces the form on success.
- **About**: chef story, kitchen philosophy, the four regions in depth, sourcing and press. **404** is a branded not-found page.
- **Accessibility** (WCAG 2.1 AA):
  - Landmarks, one `h1` per page, skip link and visible saffron focus rings.
  - 44px touch targets.
  - All text at 4.5:1 contrast or better (muted `#A89A85` on ink is about 7.1:1).
  - Full keyboard support.
  - `prefers-reduced-motion` turns off reveals, the hero zoom, parallax, pinning, carousel autoplay, the video and the cursor accent.

## Performance notes

These are measured on the production build (gzipped):

| Page | JS | CSS (inlined) | Lighthouse mobile (Perf / A11y / BP / SEO) | LCP (slow 4G, real throttling) |
|---|---|---|---|---|
| Home | 6.1 KB initial + 44 KB GSAP after `load` | ~9 KB | 99–100 / 100 / 100 / 100 | 1.5 s |
| Menu | 2.9 KB | ~9 KB | 99–100 / 100 / 100 / 100 | 1.7 s |
| Reserve | 3.5 KB | ~9 KB | 100 / 100 / 100 / 100 | 0.8 s |
| About | 1.6 KB | ~9 KB | 98 / 100 / 100 / 100 | 2.1 s |

These were measured with the real photography. LCP images (the hero poster and the About portrait) are AVIF, and each is preloaded with exactly the `srcset` its `<picture>` uses.

CLS is at most 0.001 on every page. Metric-matched fallback fonts (`size-adjust` / `ascent-override`) keep the web-font swap from moving text.

### Algorithmic choices

- **Menu: Map grouping.** Every item is static HTML; there is no runtime JSON fetch. One O(n) pass on load parses each card's data attributes once and groups the elements into `Map<TabId, Item[]>`. Switching tabs is an O(1) lookup that toggles one panel. Filtering only walks the active tab's *k* items, and is skipped entirely if that tab was already filtered with the same settings.
- **Menu: bitmask diets.** `veg = 1, vegan = 2, gf = 4`. Each item's mask is computed at build time (`data-diet-mask`). The filter test is a single expression: `(mask & filter) === filter && spice <= maxSpice`.
- **Batched writes.** Menu updates are coalesced into one `requestAnimationFrame`. The first render is synchronous, so the URL state is painted with no flash.
- **Delegated listeners.** The region map has one listener set for all SVG paths and chips. The gallery has one click listener for every thumbnail. The menu, carousel, mobile nav and lightbox each delegate from their root.
- **One shared IntersectionObserver** reveals every `.reveal` element and unobserves each after it appears. The nav's solid state comes from an IntersectionObserver on a sentinel, as does active-section highlighting. There are **no scroll listeners** for state.
- **O(1) region lookup.** `regions.json` is keyed by id.
- **No layout thrashing.**
  - The cursor's `pointermove` only stores coordinates. A self-stopping rAF loop writes `transform`.
  - The pinned track measures its scroll distance only on ScrollTrigger refresh.
  - Animations touch `transform` and `opacity` only, with `will-change` set while active.
- **Loading.**
  - The hero AVIF is preloaded with the exact `srcset` the `<picture>` uses, so it isn't fetched twice.
  - Only the hero font weight is preloaded.
  - Everything below the fold is `loading="lazy"` + `decoding="async"` with explicit dimensions.
  - Below-fold sections use `content-visibility: auto`.
  - Gallery full-size images are fetched only when the lightbox opens.
  - The map iframe is lazy.
  - The hero video loads after `load`, and only when Save-Data is off, the connection isn't 2G, and motion is allowed.
- **Build-time validation.** `src/lib/data.ts` fails the build on duplicate ids, unknown regions, bad prices, missing images and similar mistakes.

## Images & credits

All photography is from [Unsplash](https://unsplash.com), used under the free [Unsplash License](https://unsplash.com/license) (paid Unsplash+ images excluded). Each photographer is credited in [IMAGES.md](IMAGES.md), generated from `src/data/credits.json`.

Thanks to Venti Views, Muhammad Rahiman Abdulmanab, Hsu-Han, MuiZur, brahmediting, Alfonso Betancourt, Büşra İnce, Zahrin Lukman, Pinaak Kumar, Jon Handley, Md Mahdi, German Krupenin, Hrushi Chavhan, morteza kholghi, Izzedine Elfatih, Ethan Smith, Mae Mu, Gastro Editorial, CHUTTERSNAP, VK bro and Giri.

The photos illustrate a fictional restaurant. They don't depict the actual dishes, kitchen or "Chef Arjun Rao", and the alt text describes what each photo really shows. To swap one, replace the file in `src/assets/images/` (same name, same aspect ratio) and update `src/data/credits.json`. `npm run assets` recreates placeholders for any missing files and rewrites IMAGES.md.

Icons: [Lucide](https://lucide.dev) (ISC). Fonts: Cormorant Garamond and Inter via [Fontsource](https://fontsource.org) (OFL). Map: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repo. The **Astro** preset is detected automatically.
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy. `vercel.json` turns on clean URLs (`/menu` serves `menu.html`) and long-lived immutable caching for `/_astro/*`.
4. Update `site` in `astro.config.mjs`, `url` in `src/data/site.ts`, and the `Sitemap:` line in `public/robots.txt` to the production domain.

Or deploy from the CLI with `npx vercel --prod`.

## Swapping in a real booking backend

`submitReservation()` in `src/scripts/reserve-form.ts` is the only function that persists a booking. Replace its body with, for example, a Supabase insert and return `{ ok, reference }`. Nothing else needs to change.

---

Designed & built by Mayank Yadav.
