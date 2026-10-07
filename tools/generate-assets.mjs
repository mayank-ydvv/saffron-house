#!/usr/bin/env node
/**
 * Generates local placeholder photos (warm, low-key gradients at the right aspect ratio),
 * the 1200×630 Open Graph image, and IMAGES.md.
 *
 * Existing files are NEVER overwritten: drop a real photo in with the same filename and it wins.
 * Run: npm run assets
 */
import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('..', import.meta.url);
const imagesDir = new URL('src/assets/images/', root);

/** One source of truth for every photo the site needs. */
const images = [
  { file: 'hero-poster.jpg', w: 2400, h: 1350, use: 'Home hero poster (LCP image)', terms: 'dark moody indian food table brass candlelight, low-key food photography' },
  { file: 'philosophy.jpg', w: 1200, h: 1800, use: 'Home: Our Story portrait', terms: 'hands saffron milk brass bowl dark, indian chef hands close-up' },
  { file: 'galouti.jpg', w: 1200, h: 1500, use: 'Signature dish: Galouti Kebab', terms: 'galouti kebab, seekh kebab dark plate, lucknowi kebab' },
  { file: 'pepper-crab.jpg', w: 1200, h: 1500, use: 'Signature dish: Chettinad Pepper Crab', terms: 'pepper crab indian, crab masala dark background' },
  { file: 'nihari.jpg', w: 1200, h: 1500, use: 'Signature dish: Awadhi Nihari', terms: 'nihari lamb shank, mutton curry dark moody' },
  { file: 'rogan-josh.jpg', w: 1200, h: 1500, use: 'Signature dish: Kashmiri Rogan Josh', terms: 'rogan josh, kashmiri lamb curry red' },
  { file: 'prawn-curry.jpg', w: 1200, h: 1500, use: 'Signature dish: Konkan Prawn Curry', terms: 'prawn coconut curry, goan prawn curry dark' },
  { file: 'gucchi-pulao.jpg', w: 1200, h: 1500, use: 'Signature dish: Gucchi Pulao', terms: 'morel mushroom rice, saffron pulao copper pot' },
  { file: 'chef.jpg', w: 2400, h: 1030, use: 'Home: chef section, full width (21:9)', terms: 'chef plating dark kitchen warm light, indian chef at the pass' },
  { file: 'chef-portrait.jpg', w: 1200, h: 1500, use: 'About: chef portrait', terms: 'indian chef portrait apron dark background' },
  { file: 'gallery-01.jpg', w: 1200, h: 1600, use: 'Gallery (3:4)', terms: 'saffron threads slate macro' },
  { file: 'gallery-02.jpg', w: 1200, h: 1200, use: 'Gallery (1:1)', terms: 'hands cooking kebab tawa, chef hands close-up' },
  { file: 'gallery-03.jpg', w: 1200, h: 1500, use: 'Gallery (4:5)', terms: 'biryani handi steam, dum biryani copper pot' },
  { file: 'gallery-04.jpg', w: 1500, h: 1000, use: 'Gallery (3:2)', terms: 'dark restaurant interior candlelight brass lamps' },
  { file: 'gallery-05.jpg', w: 1200, h: 1600, use: 'Gallery (3:4)', terms: 'fine dining indian plating black stone plate' },
  { file: 'gallery-06.jpg', w: 1200, h: 1200, use: 'Gallery (1:1)', terms: 'whole spices roasting iron pan' },
  { file: 'gallery-07.jpg', w: 1200, h: 1500, use: 'Gallery (4:5)', terms: 'old fashioned cocktail dark bar, bartender stirring' },
  { file: 'gallery-08.jpg', w: 1500, h: 1000, use: 'Gallery (3:2)', terms: 'kulfi dessert pistachio, indian dessert plating' },
  { file: 'gallery-09.jpg', w: 1200, h: 1600, use: 'Gallery (3:4)', terms: 'brass copper utensils kitchen shelf' },
  { file: 'kitchen.jpg', w: 1800, h: 1200, use: 'About: kitchen (3:2)', terms: 'open kitchen charcoal grill restaurant service' },
  { file: 'spices.jpg', w: 1800, h: 1200, use: 'About: sourcing (3:2)', terms: 'spice sacks cardamom pepper market dark' },
];

/** Deterministic 0..1 values from a filename so each placeholder looks a little different. */
function seeded(name) {
  let h = 2166136261;
  for (const c of name) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 1000) / 1000;
}

function placeholderSvg({ file, w, h }) {
  const r = seeded(file);
  const cx = 25 + r() * 50;
  const cy = 30 + r() * 40;
  const hue = 22 + r() * 18; // saffron → amber
  const glow = `hsl(${hue} 70% ${30 + r() * 12}%)`;
  const mid = `hsl(${hue - 8} 45% 12%)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g" cx="${cx}%" cy="${cy}%" r="75%">
      <stop offset="0" stop-color="${glow}"/>
      <stop offset=".45" stop-color="${mid}"/>
      <stop offset="1" stop-color="#0E0B08"/>
    </radialGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".55" stop-color="#0E0B08" stop-opacity="0"/>
      <stop offset="1" stop-color="#0E0B08" stop-opacity=".6"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <text x="${w * 0.04}" y="${h - w * 0.04}" font-family="Georgia, serif" font-size="${Math.round(w * 0.022)}" fill="#B8893E" fill-opacity=".45" letter-spacing="4">${file}</text>
</svg>`;
}

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="70%">
      <stop offset="0" stop-color="#5C1A1B"/>
      <stop offset=".6" stop-color="#1A1410"/>
      <stop offset="1" stop-color="#0E0B08"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(568 150) scale(2)" fill="none" stroke="#E3A21A" stroke-width="2" stroke-linecap="round">
    <path d="M16 30V9"/><path d="M16 30C16 21 13.5 13 8.5 6.5"/><path d="M16 30c0-9 2.5-17 7.5-23.5"/>
    <g fill="#E3A21A" stroke="none"><path d="M14 9.2 16 3l2 6.2z"/><path d="m6.2 8 1.4-6.4 3.2 4.8z"/><path d="m21.2 6.4 3.2-4.8L25.8 8z"/></g>
  </g>
  <text x="600" y="330" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="64" letter-spacing="22" fill="#F3EADB">SAFFRON HOUSE</text>
  <rect x="570" y="370" width="60" height="1.5" fill="#B8893E"/>
  <text x="600" y="430" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="36" fill="#F3EADB" fill-opacity=".85">A royal table, reimagined.</text>
  <text x="600" y="560" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="6" fill="#A89A85">INDIAN FINE DINING · CHENNAI</text>
</svg>`;

async function writeIfMissing(url, svg) {
  if (existsSync(url)) return false;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(fileURLToPath(url));
  return true;
}

let created = 0;
for (const img of images) {
  if (await writeIfMissing(new URL(img.file, imagesDir), placeholderSvg(img))) created++;
}
if (await writeIfMissing(new URL('public/og.jpg', root), ogSvg)) created++;

const ratio = (w, h) => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
};

const credits = existsSync(new URL('src/data/credits.json', root))
  ? JSON.parse(readFileSync(new URL('src/data/credits.json', root), 'utf8'))
  : {};
const creditLines = Object.entries(credits)
  .map(([file, c]) => `- \`${file}\`: photo by ${c.photographer} on [${c.source}](${c.url})`)
  .join('\n');

const md = `# Images

Photography is from Unsplash (free Unsplash License); credits are below and in \`src/data/credits.json\`.
Missing files fall back to **generated placeholders** at the correct aspect ratio. To replace a photo, save one with the
**same filename** in \`src/assets/images/\` and update its entry in \`src/data/credits.json\`.
Astro re-encodes it to AVIF/WebP at 480/960/1600 widths at build time.

Art direction: dark, low-key and warm. Close-up plating, hands, steam, brass and copperware. Avoid bright backgrounds.
Minimum source size is listed below; larger is fine. Keep the aspect ratio (crop before saving).

Regenerate placeholders for any missing files with \`npm run assets\`. Existing files are never overwritten.

| File | Min size | Ratio | Used for | Search terms (Unsplash / Pexels) |
|---|---|---|---|---|
${images.map((i) => `| \`${i.file}\` | ${i.w}×${i.h} | ${ratio(i.w, i.h)} | ${i.use} | ${i.terms} |`).join('\n')}
| \`public/og.jpg\` | 1200×630 | 1.91:1 | Social share card | Generated wordmark card; replace with a branded photo if you like |

## Hero video (optional)

Add \`public/video/hero.mp4\` (H.264) and \`public/video/hero.webm\` (VP9), 8–10 s, seamless loop, no audio,
1920×1080 or 1280×720, ideally under 2.5 MB each. Search: "indian cooking slow motion dark", "steam tandoor",
"spices falling slow motion". The video player switches on automatically at the next build once both files exist.

## Credits

${creditLines || 'Add the photographer and source for each photo to src/data/credits.json.'}
`;
await writeFile(new URL('IMAGES.md', root), md);

console.log(`Assets: ${created} placeholder(s) created, ${images.length + 1 - created} already present. IMAGES.md written.`);
