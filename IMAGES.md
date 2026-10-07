# Images

The site ships with **generated placeholders** (warm gradients at the correct aspect ratio), so layout never shifts
when real photography is added. To replace one, save a photo with the **same filename** in `src/assets/images/`.
Astro re-encodes it to AVIF/WebP at 480/960/1600 widths at build time.

Art direction: dark, low-key and warm. Close-up plating, hands, steam, brass and copperware. Avoid bright backgrounds.
Minimum source size is listed below; larger is fine. Keep the aspect ratio (crop before saving).

Regenerate placeholders for any missing files with `npm run assets`. Existing files are never overwritten.

| File | Min size | Ratio | Used for | Search terms (Unsplash / Pexels) |
|---|---|---|---|---|
| `hero-poster.jpg` | 2400×1350 | 16:9 | Home hero poster (LCP image) | dark moody indian food table brass candlelight, low-key food photography |
| `philosophy.jpg` | 1200×1800 | 2:3 | Home: Our Story portrait | hands saffron milk brass bowl dark, indian chef hands close-up |
| `galouti.jpg` | 1200×1500 | 4:5 | Signature dish: Galouti Kebab | galouti kebab, seekh kebab dark plate, lucknowi kebab |
| `pepper-crab.jpg` | 1200×1500 | 4:5 | Signature dish: Chettinad Pepper Crab | pepper crab indian, crab masala dark background |
| `nihari.jpg` | 1200×1500 | 4:5 | Signature dish: Awadhi Nihari | nihari lamb shank, mutton curry dark moody |
| `rogan-josh.jpg` | 1200×1500 | 4:5 | Signature dish: Kashmiri Rogan Josh | rogan josh, kashmiri lamb curry red |
| `prawn-curry.jpg` | 1200×1500 | 4:5 | Signature dish: Konkan Prawn Curry | prawn coconut curry, goan prawn curry dark |
| `gucchi-pulao.jpg` | 1200×1500 | 4:5 | Signature dish: Gucchi Pulao | morel mushroom rice, saffron pulao copper pot |
| `chef.jpg` | 2400×1030 | 240:103 | Home: chef section, full width (21:9) | chef plating dark kitchen warm light, indian chef at the pass |
| `chef-portrait.jpg` | 1200×1500 | 4:5 | About: chef portrait | indian chef portrait apron dark background |
| `gallery-01.jpg` | 1200×1600 | 3:4 | Gallery (3:4) | saffron threads slate macro |
| `gallery-02.jpg` | 1200×1200 | 1:1 | Gallery (1:1) | hands cooking kebab tawa, chef hands close-up |
| `gallery-03.jpg` | 1200×1500 | 4:5 | Gallery (4:5) | biryani handi steam, dum biryani copper pot |
| `gallery-04.jpg` | 1500×1000 | 3:2 | Gallery (3:2) | dark restaurant interior candlelight brass lamps |
| `gallery-05.jpg` | 1200×1600 | 3:4 | Gallery (3:4) | fine dining indian plating black stone plate |
| `gallery-06.jpg` | 1200×1200 | 1:1 | Gallery (1:1) | whole spices roasting iron pan |
| `gallery-07.jpg` | 1200×1500 | 4:5 | Gallery (4:5) | old fashioned cocktail dark bar, bartender stirring |
| `gallery-08.jpg` | 1500×1000 | 3:2 | Gallery (3:2) | kulfi dessert pistachio, indian dessert plating |
| `gallery-09.jpg` | 1200×1600 | 3:4 | Gallery (3:4) | brass copper utensils kitchen shelf |
| `kitchen.jpg` | 1800×1200 | 3:2 | About: kitchen (3:2) | open kitchen charcoal grill restaurant service |
| `spices.jpg` | 1800×1200 | 3:2 | About: sourcing (3:2) | spice sacks cardamom pepper market dark |
| `public/og.jpg` | 1200×630 | 1.91:1 | Social share card | Generated wordmark card; replace with a branded photo if you like |

## Hero video (optional)

Add `public/video/hero.mp4` (H.264) and `public/video/hero.webm` (VP9), 8–10 s, seamless loop, no audio,
1920×1080 or 1280×720, ideally under 2.5 MB each. Search: "indian cooking slow motion dark", "steam tandoor",
"spices falling slow motion". The video player switches on automatically at the next build once both files exist.

## Credits

Add the photographer and source for each photo here and in README.md, for example:
`hero-poster.jpg` — Photo by NAME on Unsplash (link).
