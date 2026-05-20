// ── BRAND TOKENS ──────────────────────────────────────────
export const T = {
  burgundy: '#6B1A2E',
  burgundyDeep: '#3D0A16',
  burgundyMid: '#891E38',
  blushBg: '#FDEEF2',
  blushLight: '#F7D6DC',
  blushMid: '#F0B8C4',
  blushBorder: '#E8C4CC',
  borderMuted: '#D4919F',
  textMuted: '#9B6070',
  textAccent: '#8B3545',
  cream: '#FDF0F3',
  dark: '#1E0A10',
  darkDeep: '#120408',
};

// ── PRODUCT DATA ──────────────────────────────────────────
export const PRODUCTS = [
  {
    id: 1,
    name: 'Lucky Knot Keychain',
    sub: 'braided · gold charm',
    price: 450,
    bg: '#F5E0E6',

    badge: 'New',
    category: 'keychains',
    stock: 3,
    inspiration:
      'Inspired by the ancient art of knotwork — each knot tied with intention, carrying its own small magic.',
    details: {
      Material: 'Waxed cord + brass',
      Length: '~12 cm',
      Charm: 'Gold-toned ring',
      'Ships in': '3–5 days',
    },
  },
  {
    id: 2,
    name: 'Jellyfish Charm',
    sub: 'beaded · iridescent',
    price: 380,
    bg: '#EDE0EC',

    badge: null,
    category: 'keychains',
  },
  {
    id: 3,
    name: 'Merci Necklace',
    sub: 'layering · beaded',
    price: 650,
    bg: '#F0E8DE',

    badge: 'Bestseller',
    category: 'necklaces',
    stock: 10,
    inspiration:
      'A love letter to French elegance — layered, light, effortless.',
  },
  {
    id: 4,
    name: 'Golden Hour Set',
    sub: 'earrings + bracelet',
    price: 820,
    bg: '#E8ECF4',

    badge: null,
    category: 'earrings',
  },
  {
    id: 5,
    name: 'Swan Lake Earrings',
    sub: 'drop · pearl bead',
    price: 520,
    bg: '#E8F0E8',

    badge: null,
    category: 'earrings',
  },
  {
    id: 6,
    name: 'Cherry Bow Bracelet',
    sub: 'beaded · ribbon charm',
    price: 390,
    bg: '#F0ECE0',

    badge: 'Sold out',
    soldOut: true,
    category: 'bracelets',
  },
];

export const CATS = ['All', 'Keychains', 'Earrings', 'Necklaces', 'Bracelets', 'New arrivals'];

