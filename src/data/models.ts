import { z } from 'astro/zod';
import { meta } from './media';

// The Cave Co. range and shared model content. The data lives in src/content/*.json, which
// the client edits through the CMS (/cms). Everything is checked here at build time, so a bad
// edit stops the build with a clear message instead of publishing a broken page.

const image = z.string().min(1, 'image is missing').refine((p) => { try { meta(p); return true; } catch { return false; } },
  (p) => ({ message: `image not found: ${p}` }));
const optImage = z.string().default('').refine((p) => !p || (() => { try { meta(p); return true; } catch { return false; } })(),
  (p) => ({ message: `image not found: ${p}` }));
const text = z.string().trim();

/** A room on the floor plan. Box is in % of the plan image: left, top, width, height. */
const room = z.object({ name: text.min(1), size: text.optional(), box: z.tuple([z.number(), z.number(), z.number(), z.number()]) });
export type Room = z.infer<typeof room>;

const pic = z.object({ image, label: text.min(1) });

const modelSchema = z.object({
  order: z.number().default(99),
  name: text.min(1),
  kind: text.min(1),
  area: text.default(''),
  beds: text.min(1),
  baths: z.number().int().min(0),
  price: text.default(''),
  outdoor: text.default(''),
  collection: text.default(''),
  line: text.default(''),
  blurb: text.min(1),
  hero: image,
  card: image,
  brochure: text.default(''),
  exteriors: z.array(pic).min(1, 'add at least one outside photo'),
  interiors: z.array(pic).default([]),
  plan: image,
  rooms: z.array(room).default([]),
});

/** Parse a content file, with the file name in any error. */
const load = <T extends z.ZodTypeAny>(schema: T, data: unknown, file: string): z.infer<T> => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const why = r.error.issues.map((i) => `  - ${i.path.join('.') || '(file)'}: ${i.message}`).join('\n');
    throw new Error(`Content error in src/content/${file}:\n${why}`);
  }
  return r.data;
};

const files = import.meta.glob('../content/models/*.json', { eager: true, import: 'default' });
export const models = Object.entries(files)
  .map(([f, data]) => {
    const slug = f.split('/').pop()!.replace(/\.json$/, '');
    const m = load(modelSchema, data, `models/${slug}.json`);
    // empty strings from the CMS mean "not set"
    return { ...m, slug, area: m.area || undefined, price: m.price || undefined };
  })
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
export type Model = (typeof models)[number];

export const specLine = (m: Model) => [m.area, m.beds, `${m.baths} bath${m.baths === 1 ? '' : 's'}`].filter(Boolean).join(' · ');

import includedJson from '../content/included.json';
import collectionsJson from '../content/collections.json';
import addonsJson from '../content/addons.json';
import processJson from '../content/process.json';
import settingsJson from '../content/settings.json';

/** "What is included" groups (model page accordion). */
export const included = load(z.object({ groups: z.array(z.object({ title: text.min(1), items: z.array(text.min(1)).min(1) })) }), includedJson, 'included.json').groups;

/** Build classes. A model joins one by naming it in its "collection" field. */
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'collection';
export const collections = load(z.object({ collections: z.array(z.object({ name: text.min(1), line: text.default('') })) }), collectionsJson, 'collections.json')
  .collections.map((c) => ({ ...c, slug: slugify(c.name), models: models.filter((m) => m.collection === c.name).map((m) => m.slug) }));
export type Collection = (typeof collections)[number];

/** "Make it yours" add-ons. Price and photo are optional (placeholders show until set). */
export const addons = load(z.object({ addons: z.array(z.object({ name: text.min(1), price: text.default(''), image: optImage })) }), addonsJson, 'addons.json')
  .addons.map((a) => ({ ...a, price: a.price || undefined, image: a.image || undefined }));

/** The process steps, shared by the landing page and the model pages. */
export const steps = load(z.object({ steps: z.array(z.object({ name: text.min(1), text: text.min(1), image })).min(1) }), processJson, 'process.json').steps;

/** Company brochure, used by every model without its own. */
export const brochure = (settingsJson as { brochure?: string }).brochure || '';
/** Per-model brochure PDFs (set in each model's "brochure" field). */
export const brochures: Record<string, string> = Object.fromEntries(models.filter((m) => m.brochure).map((m) => [m.slug, m.brochure]));
