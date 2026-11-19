import { z } from 'astro/zod';
import { meta } from './media';
import homeJson from '../content/home.json';

// Landing page content from src/content/home.json (editable in the CMS), checked at build.
const image = z.string().min(1, 'image is missing').refine((p) => { try { meta(p); return true; } catch { return false; } },
  (p) => ({ message: `image not found: ${p}` }));
const t = z.string().trim().min(1);
const pct = z.number().min(0).max(100);

const schema = z.object({
  hero: z.object({ title: t, text: t }),
  highlights: z.array(z.object({ image, title: t })).min(1),
  band: z.object({ title: t, image }),
  features: z.array(z.object({ name: t, text: t, image, x: pct.default(50), y: pct.default(50), zoom: z.number().min(1).max(1.6).default(1.1) })).min(1),
  models: z.object({ title: t }),
  orion: z.object({ title: t, text: t, photos: z.array(z.object({ image, label: t })).min(1) }),
  compare: z.object({ title: t, rows: z.array(z.object({ role: t, old: t, cave: t, icon: z.enum(['person', 'triangle', 'helmet', 'lamp']).default('person') })).min(1) }),
  promises: z.object({ title: t, items: z.array(z.object({ bold: t, text: t })).min(1) }),
});

const r = schema.safeParse(homeJson);
if (!r.success) {
  throw new Error(`Content error in src/content/home.json:\n${r.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')}`);
}
export const home = r.data;
