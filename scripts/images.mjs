// Resize photos uploaded through the CMS (top level of public/media) into responsive WebP files,
// the same way the original renders were prepared: 960 / 1440 / native width, never upscaled,
// capped at 2560. Writes public/_img/* and src/data/uploads.json (read by src/data/media.ts).
// Runs automatically before `npm run dev` and `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const srcDir = path.join(root, 'public/media'); // renders live in sub-folders and are skipped
const outDir = path.join(root, 'public/_img');
const manifest = path.join(root, 'src/data/uploads.json');
const MAX = 2560;
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);


fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => exts.has(path.extname(f).toLowerCase()));
const out = {};
let made = 0;

for (const f of files) {
  const src = path.join(srcDir, f);
  const name = path.basename(f, path.extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'image';
  const img = sharp(src, { failOn: 'none' }).rotate(); // respect phone photo orientation
  const meta = await img.metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const w0 = swap ? meta.height : meta.width;
  const h0 = swap ? meta.width : meta.height;
  if (!w0 || !h0) { console.warn(`images: skipped ${f} (unreadable)`); continue; }
  const native = Math.min(w0, MAX);
  const widths = [...new Set([960, 1440, native].filter((w) => w <= native))].sort((a, b) => a - b);
  const mtime = fs.statSync(src).mtimeMs;
  for (const w of widths) {
    const dest = path.join(outDir, `${name}-${w}.webp`);
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= mtime) continue;
    await sharp(src, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 86 }).toFile(dest);
    made++;
  }
  out[`/media/${f}`] = { w: native, h: Math.round((h0 * native) / w0), widths, base: `/_img/${name}` };
}

const json = JSON.stringify(out, null, 2) + '\n';
if (!fs.existsSync(manifest) || fs.readFileSync(manifest, 'utf8') !== json) fs.writeFileSync(manifest, json);
console.log(`images: ${files.length} upload(s), ${made} file(s) generated`);
