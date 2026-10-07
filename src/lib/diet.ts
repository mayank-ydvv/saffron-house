import type { Diet } from '../types';

/** Diet flags as bits so a filter check is a single AND: (mask & filter) === filter. */
export const DIET_BITS = { veg: 1, vegan: 2, gf: 4 } as const satisfies Record<Diet, number>;

export const DIET_LABELS: Record<Diet, string> = {
  veg: 'Vegetarian',
  vegan: 'Vegan',
  gf: 'Gluten-free',
};

export const toMask = (diet: readonly Diet[]): number => diet.reduce((mask, d) => mask | DIET_BITS[d], 0);
