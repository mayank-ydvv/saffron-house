import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

/** Resolve a filename from the data files to an optimisable image. Fails the build if missing. */
export function img(name: string): ImageMetadata {
  const meta = byName.get(name);
  if (!meta) throw new Error(`Image "${name}" not found in src/assets/images. Run \`npm run assets\`.`);
  return meta;
}

export const hasImage = (name: string) => byName.has(name);
