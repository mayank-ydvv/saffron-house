// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://saffron-house-psi.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  // ~9 KB of CSS per page: inlining it saves a render-blocking round trip on mobile.
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  vite: { plugins: [tailwindcss()] },
});
