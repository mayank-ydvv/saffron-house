/** Long-form page copy. Structured content (menu, regions, etc.) lives in the JSON files. */
export const content = {
  hero: {
    headline: 'A royal table, reimagined.',
    subtext: 'Seven courses from the royal kitchens of India. Forty seats in Nungambakkam.',
    image: 'hero-poster.jpg',
    alt: 'A hammered copper pot and fresh tomatoes on a wooden board in a dim, warm room',
  },

  philosophy: {
    eyebrow: 'Our story',
    title: 'Old kitchens. A new table.',
    paragraphs: [
      'Saffron House reimagines the royal kitchens of India for the modern table. Chef Arjun Rao draws on recipes from Awadh, Chettinad, Kashmir and the Konkan coast.',
      'Each is served as a seven-course tasting journey in a forty-cover dining room in Nungambakkam, Chennai. Nothing is rushed. Spices are ground each afternoon. The tandoor is lit at four.',
    ],
    image: 'philosophy.jpg',
    alt: 'Hands in low light scattering a careful pinch of seasoning over a small dish',
  },

  signature: {
    eyebrow: 'Signature dishes',
    title: 'Plates we are known for.',
    intro: 'A few dishes that never leave the menu. Ask, and we will tell you where each one began.',
  },

  tasting: {
    eyebrow: 'The tasting menu',
    title: 'Seven courses. One evening.',
    intro: 'A journey through four regions, paced for conversation. About two and a half hours.',
  },

  regions: {
    eyebrow: 'Regions of India',
    title: 'Four kitchens, one map.',
    intro: 'Choose a region to see what it brings to the table.',
  },

  chef: {
    eyebrow: 'The chef',
    name: 'Arjun Rao',
    quote: 'I am not trying to improve these recipes. I am trying to deserve them.',
    bio: [
      'Arjun Rao grew up between his grandmother’s kitchen in Karaikudi and his father’s postings in Lucknow and Srinagar. He trained in hotel kitchens in Delhi and Mumbai before spending six years cooking with home cooks, khansamas and fishing families across the country.',
      'Saffron House is the table he always wanted to set. Rigorous about origin, quiet about technique, generous at the pass.',
    ],
    image: 'chef.jpg',
    alt: 'A chef plating at the pass of a dim, warmly lit open kitchen',
    portrait: 'chef-portrait.jpg',
    portraitAlt: 'A chef in a dark jacket clapping a cloud of flour from their hands',
  },

  gallery: {
    eyebrow: 'Gallery',
    title: 'An evening, in frames.',
  },

  testimonials: {
    eyebrow: 'Kind words',
    title: 'What guests and critics say.',
    press: ['The Culinary Review', 'Dine Monthly', 'Table & Terroir', 'The Spice Ledger', 'Coastal Table'],
  },

  cta: {
    title: 'Your table awaits.',
    text: 'Forty seats. Seven courses. Tuesday to Sunday, from seven.',
  },

  location: {
    eyebrow: 'Find us',
    title: 'Location & hours.',
  },

  about: {
    eyebrow: 'About',
    title: 'The house, the chef, the craft.',
    intro:
      'Saffron House began with a simple question. What would the royal kitchens of India cook if they opened tonight, for forty guests, in Chennai?',
    philosophy: [
      {
        title: 'Origin first',
        text: 'Every dish starts with where it came from. We cook regional recipes in the region’s own way, then edit with care.',
      },
      {
        title: 'Ground each day',
        text: 'Whole spices arrive weekly and are roasted and ground every afternoon. Nothing comes from a packet.',
      },
      {
        title: 'Fire and time',
        text: 'Charcoal, wood and sealed pots. Slow methods give depth that shortcuts cannot.',
      },
    ],
    kitchenImage: 'kitchen.jpg',
    kitchenAlt: 'A chef working over a tall flame at the grill in a warmly lit kitchen',
    sourcing: {
      title: 'Where it comes from.',
      intro: 'We work with a small circle of growers, foragers and fishing families. Most we have visited. All we know by name.',
      items: [
        { what: 'Saffron', from: 'The Bhat family, Pampore, Kashmir' },
        { what: 'Black pepper & cardamom', from: 'Kalpetta Spice Collective, Wayanad' },
        { what: 'Morels', from: 'Forest foragers, Kupwara district' },
        { what: 'Seafood', from: 'Two day boats, Ratnagiri harbour' },
        { what: 'Rice', from: 'Red-rice growers, Palakkad' },
        { what: 'Dairy', from: 'Nandi Hills Farm, Karnataka' },
      ],
      image: 'spices.jpg',
      alt: 'Open sacks of grain and ground spice in a dim storeroom, lit by a single warm lamp',
    },
  },

  reserve: {
    eyebrow: 'Reservations',
    title: 'Reserve a table.',
    intro: 'Book up to sixty days ahead. For parties larger than ten, please call us.',
  },

  notFound: {
    title: 'This table isn’t on our floor plan.',
    text: 'The page you were looking for has moved, or never existed. Let us seat you somewhere better.',
  },
} as const;
