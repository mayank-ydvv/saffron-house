export type Diet = 'veg' | 'vegan' | 'gf';
export type Category = 'starters' | 'mains' | 'breads' | 'desserts' | 'drinks';
export type RegionId = 'awadh' | 'chettinad' | 'kashmir' | 'konkan';
export type TabId = 'tasting' | 'a-la-carte' | 'desserts' | 'drinks';
export type Spice = 0 | 1 | 2 | 3;

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  region: RegionId;
  description: string;
  /** Integer rupees. */
  price: number;
  diet: Diet[];
  spice: Spice;
  chefPick: boolean;
  image?: string;
}

export interface Course {
  number: number;
  name: string;
  dish: string;
  ingredients: string;
  pairing: string;
}

export interface Region {
  id: RegionId;
  name: string;
  tagline: string;
  signatureDish: string;
  spiceNotes: string;
}

export type Regions = Record<RegionId, Region>;

export interface Testimonial {
  quote: string;
  author: string;
  source: string;
}

export interface NavLink {
  label: string;
  href: string;
  /** Home-page section id this link points at, for active-section highlighting. */
  section?: string;
}

export interface SlotConfig {
  /** 24h "HH:MM". */
  open: string;
  /** Last seating, 24h "HH:MM". */
  close: string;
  stepMinutes: number;
  /** 0 = Sunday … 6 = Saturday. */
  closedDays: number[];
}
