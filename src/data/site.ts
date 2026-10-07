import type { NavLink, SlotConfig } from '../types';

export const site = {
  name: 'Saffron House',
  tagline: 'A royal table, reimagined.',
  description:
    'Saffron House reimagines the royal kitchens of India for the modern table. A seven-course tasting journey through Awadh, Chettinad, Kashmir and the Konkan coast, in Nungambakkam, Chennai.',
  url: 'https://saffron-house.vercel.app',
  locale: 'en_IN',

  address: {
    street: '7 Kesar Lane',
    locality: 'Nungambakkam',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600006',
    country: 'IN',
  },
  geo: { lat: 13.0609, lng: 80.2496 },
  phone: '+91 44 5550 1040',
  email: 'reservations@saffronhouse.example',

  hours: [
    { days: 'Monday', time: 'Closed' },
    { days: 'Tuesday – Sunday', time: '7:00 PM – 11:00 PM' },
    { days: 'Last seating', time: '10:30 PM' },
  ],
  /** Machine-readable hours for JSON-LD. */
  openingHours: {
    dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '19:00',
    closes: '23:00',
  },
  dressCode: 'Smart casual',
  covers: 40,
  cancellation:
    'Plans change. Please give us 24 hours’ notice to cancel or move a booking, so another guest may take the table.',

  slots: { open: '19:00', close: '22:30', stepMinutes: 30, closedDays: [1] } satisfies SlotConfig,
  maxGuests: 10,
  bookingWindowDays: 60,

  tasting: { price: 6500, pairingPrice: 9000, courses: 7 },

  nav: [
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/#gallery', section: 'gallery' },
    { label: 'Contact', href: '/#location', section: 'location' },
  ] satisfies NavLink[],

  social: [
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'Facebook', href: '#', icon: 'facebook' },
    { label: 'X', href: '#', icon: 'x' },
  ] as const,

  credit: { name: 'Mayank Yadav', href: '#' },
} as const;

export type Site = typeof site;
