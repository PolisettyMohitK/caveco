// Client renders (2BHK). Served at their native width, never larger. See public/media/2bhk.
const native = { 1: 1947, 2: 1994, 3: 1987, 4: 1774, 5: 1774 } as const;
export type R = keyof typeof native;

export const render = (n: R, sizes = '(min-width: 1800px) 1774px, 100vw') => ({
  src: `/media/2bhk/ext-${n}-1440.webp`,
  srcset: `/media/2bhk/ext-${n}-960.webp 960w, /media/2bhk/ext-${n}-1440.webp 1440w, /media/2bhk/ext-${n}-${native[n]}.webp ${native[n]}w`,
  sizes,
  width: native[n],
  height: Math.round(native[n] / ({ 1: 2.41, 2: 2.53, 3: 2.51, 4: 2, 5: 2 }[n])),
});
