import { cropStyle } from './site';

// Only facts we actually know are filled in. Unknown values stay undefined and are
// simply not shown on the site. TODO(client): sizes, rooms, prices for each model.
export type Model = {
  slug: string;
  name: string;
  kind: string;
  status: 'built' | 'render' | 'soon';
  days: number;
  area?: string;
  beds?: number;
  baths?: number;
  price?: string;
  blurb: string;
  cover: string | null;
  /** Extra CSS on the cover in portrait cards, e.g. to crop out text baked into an IG post. */
  coverStyle?: string;
  /** Same idea for wide frames (model hero, finish switcher). */
  heroStyle?: string;
  gallery: { src: string; label: string }[];
  finishes: { name: string; src: string | null; style?: string }[];
};

export const models: Model[] = [
  {
    slug: 'orion',
    name: 'Orion',
    kind: 'Courtyard farmhouse',
    status: 'built',
    days: 90,
    blurb: 'Built around a courtyard, a koi pond and a pool. Glass on every side faces the garden.',
    cover: '/media/ig/orion-ext-6.webp',
    gallery: [
      { src: '/media/ig/orion-ext-2.webp', label: 'Pool at dusk' },
      { src: '/media/ig/orion-ext-5.webp', label: 'Courtyard' },
      { src: '/media/ig/orion-int-3.webp', label: 'Living room' },
      { src: '/media/ig/orion-int-10.webp', label: 'Bedroom' },
      { src: '/media/ig/orion-int-5.webp', label: 'Bath' },
    ],
    finishes: [
      { name: 'Dusk', src: '/media/ig/orion-ext-6.webp' },
      { name: 'Daylight', src: '/media/ig/orion-ext-3.webp' },
      { name: 'Timber entry', src: '/media/ig/orion-ext-4.webp' },
    ],
  },
  {
    slug: 'studio-pod',
    name: 'Studio Pod',
    kind: 'Weekend cabin',
    status: 'render',
    days: 90,
    blurb: 'A gabled cabin with one glass end. Room for two, a kitchenette and a deck.',
    cover: '/media/ig/misc-2.webp',
    coverStyle: cropStyle(2.1, 0.52, 0.86),
    heroStyle: 'object-position:50% 100%', // TODO(client): clean render without baked-in text
    gallery: [],
    finishes: [
      { name: 'White panel', src: '/media/ig/misc-2.webp', style: 'object-position:50% 100%' },
      { name: 'Charcoal panel', src: null },
    ],
  },
  {
    slug: 'next',
    name: 'Next model',
    kind: 'Family farmhouse',
    status: 'soon',
    days: 90,
    blurb: 'A larger home for families who stay the whole weekend.',
    cover: null,
    gallery: [],
    finishes: [],
  },
];

export const included = [
  { title: 'Structure', items: ['Light-gauge steel frame', 'Insulated wall and roof panels', 'Foundation and plinth', 'Rainwater drainage'] },
  { title: 'Interiors', items: ['Flooring and wall finishes', 'Modular kitchen', 'Wardrobes and storage', 'Doors and glazing'] },
  { title: 'Fittings', items: ['Bath fixtures', 'Wiring and lighting', 'Plumbing', 'Fan and AC points'] },
  { title: 'Paperwork', items: ['Design and drawings', 'Approvals support', 'Site supervision', 'Handover'] },
];

export const specLine = (m: Model) =>
  [m.area, m.beds && `${m.beds} bed`, m.baths && `${m.baths} bath`, `${m.days} days`].filter(Boolean).join(' · ');
