/**
 * Typed access to the JSON content, validated once at build time.
 * A typo in a data file fails the build instead of shipping a broken page.
 */
import menuJson from '../data/menu.json';
import tastingJson from '../data/tasting.json';
import regionsJson from '../data/regions.json';
import testimonialsJson from '../data/testimonials.json';
import galleryJson from '../data/gallery.json';
import type { Category, Course, GalleryImage, MenuItem, Regions, Testimonial } from '../types';
import { hasImage } from './images';

export const menu = menuJson as MenuItem[];
export const tasting = tastingJson as Course[];
export const regions = regionsJson as Regions;
export const testimonials = testimonialsJson as Testimonial[];
export const gallery = galleryJson as GalleryImage[];

const CATEGORIES = new Set<Category>(['starters', 'mains', 'breads', 'desserts', 'drinks']);

function validate() {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const item of menu) {
    if (ids.has(item.id)) errors.push(`menu: duplicate id "${item.id}"`);
    ids.add(item.id);
    if (!CATEGORIES.has(item.category)) errors.push(`menu: ${item.id} has unknown category "${item.category}"`);
    if (!(item.region in regions)) errors.push(`menu: ${item.id} has unknown region "${item.region}"`);
    if (!Number.isInteger(item.price) || item.price <= 0) errors.push(`menu: ${item.id} price must be integer rupees`);
    if (item.spice < 0 || item.spice > 3) errors.push(`menu: ${item.id} spice must be 0–3`);
    if (item.diet.includes('vegan') && !item.diet.includes('veg')) errors.push(`menu: ${item.id} is vegan but not veg`);
    if (item.image && !hasImage(item.image)) errors.push(`menu: ${item.id} image "${item.image}" missing`);
    if (item.chefPick && !item.image) errors.push(`menu: chef's pick ${item.id} needs an image`);
    if (item.image && !item.imageAlt) errors.push(`menu: ${item.id} image needs imageAlt`);
  }
  for (const [key, region] of Object.entries(regions)) {
    if (region.id !== key) errors.push(`regions: key "${key}" does not match id "${region.id}"`);
  }
  for (const g of gallery) if (!hasImage(g.image)) errors.push(`gallery: image "${g.image}" missing`);
  tasting.forEach((c, i) => c.number !== i + 1 && errors.push(`tasting: course ${i + 1} is numbered ${c.number}`));
  if (errors.length) throw new Error(`Content validation failed:\n  ${errors.join('\n  ')}`);
}
validate();

export const chefPicks = menu.filter((item) => item.chefPick);
export const byCategory = (category: Category) => menu.filter((item) => item.category === category);
