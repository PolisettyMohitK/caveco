// Each project is an "issue" of Cave Co. Letters: a newsletter page laid out as a collage.
// Pieces flow into a 6-column grid; `size` says how wide each piece is.
export type Size = 'full' | 'two-thirds' | 'half' | 'third';
export type Piece =
  | { kind: 'photo'; src: string; caption?: string; size: Size; tall?: boolean; style?: string }
  | { kind: 'film'; src?: string; poster: string; caption?: string; size: Size; tall?: boolean } // src = mp4 when available
  | { kind: 'headline'; text: string; size: Size }
  | { kind: 'tagline'; text: string; size: Size }
  | { kind: 'text'; title?: string; body: string[]; size: Size; columns?: boolean }
  | { kind: 'quote'; text: string; who: string; size: Size }
  | { kind: 'facts'; items: { k: string; v: string }[]; size: Size };

export type Project = {
  slug: string;
  issue: number;
  date: string; // YYYY-MM-DD, places it on the calendar
  name: string;
  place: string;
  kind: string;
  cover: string;
  coverStyle?: string;
  summary: string;
  pieces: Piece[];
};

export const projects: Project[] = [
  {
    slug: 'orion-chilkur',
    issue: 2,
    date: '2026-11-11',
    name: 'Orion',
    place: 'Chilkur, Hyderabad',
    kind: 'Handover',
    cover: '/media/ig/orion-ext-2.webp',
    summary: 'A courtyard home with a koi pond, a pool and glass on every side.',
    pieces: [
      { kind: 'photo', src: '/media/ig/orion-ext-6.webp', size: 'full', caption: 'Orion at dusk, Chilkur.' },
      { kind: 'headline', text: 'A house built around a courtyard, a koi pond and a quiet idea.', size: 'two-thirds' },
      { kind: 'facts', size: 'third', items: [
        { k: 'Model', v: 'Orion' },
        { k: 'Place', v: 'Chilkur, Hyderabad' },
        { k: 'Interiors', v: 'Cave Co.' },
        { k: 'Handed over', v: 'November 2026' },
      ] },
      { kind: 'text', title: 'A place to exhale', size: 'half', columns: false, body: [
        'Orion is laid out around an open courtyard. Every main room opens onto it, so light and air reach deep into the house.',
        'Terracotta steps drop into a koi pond, and the bar counter picks up the same clay tone. A pool runs along the garden edge.',
      ] },
      { kind: 'photo', src: '/media/ig/orion-ext-5.webp', size: 'half', tall: true, caption: 'The courtyard.' },
      { kind: 'quote', text: 'Architecture, nature and mindful living — together.', who: 'Cave Co. on Orion', size: 'full' },
      { kind: 'photo', src: '/media/ig/orion-int-3.webp', size: 'third', tall: true, caption: 'Living room.' },
      { kind: 'photo', src: '/media/ig/orion-int-2.webp', size: 'third', tall: true, caption: 'Study nook.' },
      { kind: 'text', title: 'Quiet rooms', size: 'third', body: [
        'Inside, the palette is warm and soft: textured walls, timber, linen.',
        'Every corner brings textures, materials and natural tones together — understated, and every detail with a purpose.',
      ] },
      { kind: 'film', poster: '/media/ig/orion-int-10.webp', size: 'two-thirds', caption: 'Morning light in the main bedroom.' }, // TODO(client): mp4 clip
      { kind: 'tagline', text: 'Glass on every side. The garden is the wallpaper.', size: 'third' },
      { kind: 'photo', src: '/media/ig/orion-int-5.webp', size: 'half', caption: 'A garden window by the shower.' },
      { kind: 'photo', src: '/media/ig/orion-int-7.webp', size: 'half', caption: 'Dining for eight.' },
      { kind: 'photo', src: '/media/ig/orion-ext-2.webp', size: 'full', caption: 'From the pool deck.' },
    ],
  },
  {
    slug: 'experience-hub',
    issue: 1,
    date: '2026-05-16',
    name: 'Experience Hub',
    place: 'Sainikpuri, Hyderabad',
    kind: 'Opening',
    cover: '/media/ig/hub-1.jpg',
    coverStyle: 'object-position:50% 78%', // keeps the baked-in "Opening soon" text out of square crops
    summary: 'A Cave home you can walk into, built so people can feel prefab before they buy.',
    pieces: [
      { kind: 'photo', src: '/media/ig/hub-1.jpg', size: 'full', style: 'object-position:50% 60%', caption: 'The Hub, just before opening.' },
      { kind: 'headline', text: 'Come and stand inside one.', size: 'two-thirds' },
      { kind: 'facts', size: 'third', items: [
        { k: 'Place', v: 'Sainikpuri, Hyderabad' },
        { k: 'What', v: 'Experience Hub' },
        { k: 'Visits', v: 'By appointment' },
      ] },
      { kind: 'text', size: 'half', body: [
        'Prefab is easier to believe once you have walked through it. So we built one.',
        'The Hub is a working Cave structure: sit down, open the doors, knock on the walls, and talk to us about your land.',
      ] },
      { kind: 'tagline', text: 'Experience prefab construction like never before.', size: 'half' },
    ],
  },
];
