// Every client image, converted to WebP in public/media/<model>/<slug>-<width>.webp.
// Widths never exceed the source (renders ~1500-2000px; Orion photos capped at 2560 from 6000).
// Source: Downloads/CaveRenders (Drive). Skipped: "1BHK/old" (superseded) and the .zip copies.
export type Model = 'cottage' | '1bhk' | '2bhk' | 'orion';
export type Kind = 'ext' | 'int' | 'plan' | 'photo';
export type Media = { model: Model; slug: string; kind: Kind; label: string; w: number; h: number; widths: number[] };

// Names and areas from the client's design deck (CAVE.CO Design presentation)
export const modelInfo: Record<Model, { name: string; area?: string; note: string }> = {
  cottage: { name: 'Cottage', area: '450 sft', note: 'Suite room: gabled roof, timber cladding, hot tub deck' },
  '1bhk': { name: '1BHK Villa', area: '600 sft', note: 'White plaster villa with pool' },
  '2bhk': { name: '2BHK Villa', note: 'Stone facade, hipped roof and pool deck' },
  orion: { name: 'Orion', note: 'Finished build at Chilkur, Hyderabad (real photographs)' },
};

export const media: Media[] = [
  { model: '1bhk', slug: 'ext-s1a', kind: 'ext', label: "Front, pool and steps", w: 1774, h: 887, widths: [960, 1440, 1774] },
  { model: '1bhk', slug: 'ext-s1b', kind: 'ext', label: "Front, pool and steps (evening)", w: 1774, h: 887, widths: [960, 1440, 1774] },
  { model: '1bhk', slug: 'ext-s2a', kind: 'ext', label: "Corner view", w: 1672, h: 941, widths: [960, 1440, 1672] },
  { model: '1bhk', slug: 'ext-s2b', kind: 'ext', label: "Corner view (evening)", w: 1804, h: 872, widths: [960, 1440, 1804] },
  { model: '1bhk', slug: 'ext-s3a', kind: 'ext', label: "Across the pool", w: 1671, h: 941, widths: [960, 1440, 1671] },
  { model: '1bhk', slug: 'ext-s3b', kind: 'ext', label: "Across the pool (evening)", w: 1804, h: 872, widths: [960, 1440, 1804] },
  { model: '1bhk', slug: 'ext-s4a', kind: 'ext', label: "Pool and pergola", w: 1672, h: 941, widths: [960, 1440, 1672] },
  { model: '1bhk', slug: 'ext-s4b', kind: 'ext', label: "Pool and pergola (late sun)", w: 1671, h: 941, widths: [960, 1440, 1671] },
  { model: '1bhk', slug: 'ext-s4c', kind: 'ext', label: "Pool and pergola (golden hour)", w: 1672, h: 940, widths: [960, 1440, 1672] },
  { model: '1bhk', slug: 'int-s1a', kind: 'int', label: "Living room", w: 1509, h: 1042, widths: [960, 1440, 1509] },
  { model: '1bhk', slug: 'int-s1b', kind: 'int', label: "Living room (alt)", w: 1510, h: 1042, widths: [960, 1440, 1510] },
  { model: '1bhk', slug: 'int-s2a', kind: 'int', label: "Media wall", w: 1494, h: 1053, widths: [960, 1440, 1494] },
  { model: '1bhk', slug: 'int-s2b', kind: 'int', label: "Media wall (alt)", w: 1494, h: 1053, widths: [960, 1440, 1494] },
  { model: '1bhk', slug: 'int-s3a', kind: 'int', label: "Kitchen", w: 1495, h: 1052, widths: [960, 1440, 1495] },
  { model: '1bhk', slug: 'int-s3b', kind: 'int', label: "Kitchen (alt)", w: 1495, h: 1052, widths: [960, 1440, 1495] },
  { model: '1bhk', slug: 'int-s4a', kind: 'int', label: "Dining and living", w: 1494, h: 1053, widths: [960, 1440, 1494] },
  { model: '1bhk', slug: 'int-s4b', kind: 'int', label: "Dining and living (alt)", w: 1494, h: 1053, widths: [960, 1440, 1494] },
  { model: '1bhk', slug: 'int-s5a', kind: 'int', label: "Bedroom", w: 1496, h: 1051, widths: [960, 1440, 1496] },
  { model: '1bhk', slug: 'int-s5b', kind: 'int', label: "Bedroom (alt)", w: 1497, h: 1051, widths: [960, 1440, 1497] },
  { model: '1bhk', slug: 'int-s5c', kind: 'int', label: "Bedroom (crop)", w: 1374, h: 1145, widths: [960, 1374] },
  { model: '1bhk', slug: 'int-s6a', kind: 'int', label: "Bedroom, angled", w: 1496, h: 1051, widths: [960, 1440, 1496] },
  { model: '1bhk', slug: 'int-s6b', kind: 'int', label: "Bedroom, angled (alt)", w: 1496, h: 1051, widths: [960, 1440, 1496] },
  { model: '1bhk', slug: 'plan', kind: 'plan', label: "Floor plan, 600 sft", w: 2046, h: 1237, widths: [960, 1440, 2046] },
  { model: 'cottage', slug: 'ext-1', kind: 'ext', label: "Front porch and glazing", w: 1497, h: 1051, widths: [960, 1440, 1497] },
  { model: 'cottage', slug: 'ext-2', kind: 'ext', label: "Side elevation and deck", w: 1497, h: 1051, widths: [960, 1440, 1497] },
  { model: 'cottage', slug: 'ext-3', kind: 'ext', label: "Porch and seating deck", w: 1282, h: 900, widths: [960, 1282] },
  { model: 'cottage', slug: 'ext-4', kind: 'ext', label: "Side facade and deck", w: 1497, h: 931, widths: [960, 1440, 1497] },
  { model: 'cottage', slug: 'ext-5', kind: 'ext', label: "Rear, steps to the hot tub", w: 1493, h: 891, widths: [960, 1440, 1493] },
  { model: 'cottage', slug: 'ext-6', kind: 'ext', label: "Side elevation at sunset", w: 1497, h: 1051, widths: [960, 1440, 1497] },
  { model: 'cottage', slug: 'ext-1a', kind: 'ext', label: "Front porch and glazing (alt)", w: 1497, h: 1051, widths: [960, 1440, 1497] },
  { model: 'cottage', slug: 'int-bedroom', kind: 'int', label: "Master bedroom", w: 1674, h: 940, widths: [960, 1440, 1674] },
  { model: 'cottage', slug: 'int-kitchenette-b', kind: 'int', label: "Kitchenette (alt)", w: 1673, h: 940, widths: [960, 1440, 1673] },
  { model: 'cottage', slug: 'int-living-alt', kind: 'int', label: "Living area (alt)", w: 1673, h: 940, widths: [960, 1440, 1673] },
  { model: 'cottage', slug: 'int-bed-seating', kind: 'int', label: "Bedroom and seating", w: 1673, h: 940, widths: [960, 1440, 1673] },
  { model: 'cottage', slug: 'int-bedroom-alt', kind: 'int', label: "Master bedroom (alt)", w: 1674, h: 940, widths: [960, 1440, 1674] },
  { model: 'cottage', slug: 'int-kitchenette', kind: 'int', label: "Kitchenette", w: 1673, h: 940, widths: [960, 1440, 1673] },
  { model: 'cottage', slug: 'int-kitchenette-c', kind: 'int', label: "Kitchenette (alt 2)", w: 1673, h: 940, widths: [960, 1440, 1673] },
  { model: 'cottage', slug: 'int-kitchenette-d', kind: 'int', label: "Kitchenette with sheers", w: 1674, h: 940, widths: [960, 1440, 1674] },
  { model: 'cottage', slug: 'int-living', kind: 'int', label: "Living area", w: 1671, h: 941, widths: [960, 1440, 1671] },
  { model: 'cottage', slug: 'plan', kind: 'plan', label: "Floor plan, suite room 450 sft", w: 1411, h: 2046, widths: [960, 1411] },
  { model: '2bhk', slug: 'plan', kind: 'plan', label: "Floor plan", w: 1876, h: 1109, widths: [960, 1440, 1876] },
  { model: 'orion', slug: 'photo-c3398', kind: 'photo', label: "Hallway along the glass", w: 2560, h: 3866, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-c3531', kind: 'photo', label: "Bedroom", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-1', kind: 'photo', label: "Lawn, path and pool", w: 2560, h: 1702, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-10', kind: 'photo', label: "Bathroom, green stone", w: 2560, h: 3927, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-11', kind: 'photo', label: "Walk-in shower", w: 2560, h: 3880, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-12', kind: 'photo', label: "Bathroom with skylight", w: 2560, h: 3839, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-14', kind: 'photo', label: "Shower under the skylight", w: 2560, h: 3839, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-15', kind: 'photo', label: "Bedroom", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-16', kind: 'photo', label: "Bedroom, garden view", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-17', kind: 'photo', label: "Bedroom", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-18', kind: 'photo', label: "Bedroom", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-19', kind: 'photo', label: "Study desk by the window", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-20', kind: 'photo', label: "Kitchen", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-21', kind: 'photo', label: "Dining under the skylight", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-22', kind: 'photo', label: "Dining room", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-23', kind: 'photo', label: "Living room", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-24', kind: 'photo', label: "Living room", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-25', kind: 'photo', label: "Pool and garden", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-26', kind: 'photo', label: "Courtyard at dusk", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-28', kind: 'photo', label: "Covered terrace", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-29', kind: 'photo', label: "Pool at dusk", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-3', kind: 'photo', label: "Front lawn and entrance", w: 2560, h: 3835, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-31', kind: 'photo', label: "Evening, lawn and pool", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-32', kind: 'photo', label: "Pool edge at dusk", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-1', kind: 'photo', label: "Lawn, path and pool", w: 2560, h: 1707, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-34', kind: 'photo', label: "Dining by the stone wall", w: 2560, h: 1687, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-4', kind: 'photo', label: "Pool deck", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-7', kind: 'photo', label: "Lawn and pool", w: 2560, h: 3840, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-8', kind: 'photo', label: "Living room and media wall", w: 2560, h: 1744, widths: [960, 1600, 2560] },
  { model: 'orion', slug: 'photo-9', kind: 'photo', label: "Bathroom, terracotta tile", w: 2560, h: 3846, widths: [960, 1600, 2560] },
  { model: '2bhk', slug: 'ext-1', kind: 'ext', label: "Pool facade", w: 1947, h: 808, widths: [960, 1440, 1947] },
  { model: '2bhk', slug: 'ext-2', kind: 'ext', label: "Front elevation, hipped roof", w: 1994, h: 789, widths: [960, 1440, 1994] },
  { model: '2bhk', slug: 'ext-3', kind: 'ext', label: "Living pavilion", w: 1987, h: 791, widths: [960, 1440, 1987] },
  { model: '2bhk', slug: 'ext-4', kind: 'ext', label: "Front, stone cladding", w: 1774, h: 887, widths: [960, 1440, 1774] },
  { model: '2bhk', slug: 'ext-5', kind: 'ext', label: "Corner view", w: 1774, h: 887, widths: [960, 1440, 1774] },
];

export const get = (model: Model, slug: string) => media.find((m) => m.model === model && m.slug === slug)!;
export const of = (model: Model, kind?: Kind) => media.filter((m) => m.model === model && (!kind || m.kind === kind));

/** <img> attributes: responsive srcset, never upscaled. */
export const img = (m: Media, sizes = '100vw') => {
  const base = `/media/${m.model}/${m.slug}`;
  return {
    src: `${base}-${m.widths.find((w) => w >= 1400) ?? m.widths[m.widths.length - 1]}.webp`,
    srcset: m.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    sizes, width: m.w, height: m.h,
  };
};

// ---------------------------------------------------------------------------------------------
// CMS image paths. Content files store an image as a path:
//   existing renders: /media/<model>/<slug>-<width>.webp   (any width variant)
//   CMS uploads:      /media/<file>                         (resized at build by scripts/images.mjs)
import uploads from './uploads.json';
type Upload = { w: number; h: number; widths: number[]; base: string };
const up = uploads as Record<string, Upload>;

/** Look up an image path: size, label and the files to serve. */
export const meta = (path: string): Media & { base: string } => {
  const k = /^\/media\/([^/]+)\/(.+)-\d+\.webp$/.exec(path || '');
  if (k) {
    const m = media.find((x) => x.model === k[1] && x.slug === k[2]);
    if (m) return { ...m, base: `/media/${m.model}/${m.slug}` };
  }
  const u = up[path];
  if (u) return { model: 'orion', slug: path, kind: 'photo', label: '', w: u.w, h: u.h, widths: u.widths, base: u.base };
  throw new Error(`Image not found: "${path}". Upload it in the CMS or check the path.`);
};

/** <img> attributes for a content image path. */
export const pic = (path: string, sizes = '100vw') => {
  const m = meta(path);
  return {
    src: `${m.base}-${m.widths.find((w) => w >= 1400) ?? m.widths[m.widths.length - 1]}.webp`,
    srcset: m.widths.map((w) => `${m.base}-${w}.webp ${w}w`).join(', '),
    sizes, width: m.w, height: m.h,
  };
};

/** Plans and drawings get a padded, contained look instead of a cover crop. */
export const isPlan = (path: string) => /\/plan[^/]*$/.test(path) || /plan/i.test(path.split('/').pop() || '');
