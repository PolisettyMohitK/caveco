// Floor plan layers for the drawing animation, made from the architect's own plan image.
//  - shell:  the original drawing with the inside of every room blanked out, so only the walls
//            and openings remain (the measured room outlines sit on the inside wall faces)
//  - walls:  the shell's linework, traced to SVG paths (drawn first)
//  - rooms:  the linework inside each room outline, traced to SVG paths (drawn room by room)
// Usage: npm run plans   (re-run after a model's plan image or room outlines change)
// Models without data here simply show their plan without the drawing animation.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import potrace from 'potrace';

const root = process.cwd();
const dir = path.join(root, 'src/content/models');
const out = {};

const trace = (png) => new Promise((res, rej) => potrace.trace(png, { turdSize: 6, optTolerance: 0.5, threshold: 128 }, (e, svg) => e ? rej(e) : res(svg)));
const subpaths = (svg) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' ')
  .split(/(?=M)/).map((s) => s.trim().replace(/(\d+\.\d+)/g, (n) => String(Math.round(+n * 10) / 10))).filter((s) => s.length > 12);

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const slug = file.replace(/\.json$/, '');
  const model = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  if (!model.plan || !model.rooms?.length) { console.log(slug, 'skipped (no plan or rooms)'); continue; }
  // the largest version of the plan image (existing renders: /media/<folder>/plan-<width>.webp)
  const m = /^\/media\/([^/]+)\/(.+)-\d+\.webp$/.exec(model.plan);
  if (!m) { console.log(slug, 'skipped (plan is not a prepared image)'); continue; }
  const folder = m[1];
  const src = path.join(root, 'public', model.plan);
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;
  const bg = [data[0], data[1], data[2]];
  const isInk = (i) => Math.abs(data[i * 3] - bg[0]) + Math.abs(data[i * 3 + 1] - bg[1]) + Math.abs(data[i * 3 + 2] - bg[2]) > 70;

  const boxes = model.rooms.map((r) => { const [l, t, w, h] = r.box; return [l / 100 * W, t / 100 * H, (l + w) / 100 * W, (t + h) / 100 * H]; });
  const IN = 2; // px kept inside each outline so the wall line itself is never cut
  const inside = (x, y, b, pad = 0) => x >= b[0] + pad && x < b[2] - pad && y >= b[1] + pad && y < b[3] - pad;
  // the house area: union of the room outlines plus a small margin
  const M = Math.round(Math.max(W, H) * 0.012);
  const hb = [Math.min(...boxes.map((b) => b[0])) - M, Math.min(...boxes.map((b) => b[1])) - M, Math.max(...boxes.map((b) => b[2])) + M, Math.max(...boxes.map((b) => b[3])) + M];

  const shell = Buffer.alloc(N * 3), wallMask = Buffer.alloc(N, 255);
  const roomMasks = boxes.map(() => Buffer.alloc(N, 255));
  for (let i = 0; i < N; i++) {
    const x = i % W, y = (i / W) | 0;
    const inRoom = boxes.findIndex((b) => inside(x, y, b, IN));
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const green = g > r + 25 && g > b + 25; // trees and planting are landscape, not the house
    const show = inRoom < 0 && inside(x, y, hb) && !green;
    for (let c = 0; c < 3; c++) shell[i * 3 + c] = show ? data[i * 3 + c] : bg[c];
    if (!isInk(i)) continue;
    if (show) wallMask[i] = 0;
    boxes.forEach((b, k) => { if (inside(x, y, b, IN)) roomMasks[k][i] = 0; });
  }
  const widths = [960, 1440, W].filter((w, k, a) => w <= W && a.indexOf(w) === k);
  for (const w of widths) {
    await sharp(shell, { raw: { width: W, height: H, channels: 3 } }).resize({ width: w }).webp({ quality: 90 })
      .toFile(path.join(root, `public/media/${folder}/plan-shell-${w}.webp`));
  }
  const png = (m) => sharp(m, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  const walls = subpaths(await trace(await png(wallMask)));
  const rooms = [];
  for (const m of roomMasks) rooms.push(subpaths(await trace(await png(m))));
  out[model.plan] = { w: W, h: H, shell: `/media/${folder}/plan-shell`, widths, walls, rooms };
  const kb = (a) => (JSON.stringify(a).length / 1024).toFixed(0);
  console.log(slug, `${W}x${H}`, 'walls', walls.length, kb(walls) + 'KB', '| rooms', rooms.map((r) => r.length).join('/'), kb(rooms) + 'KB');
}
fs.writeFileSync(path.join(root, 'src/data/plan-lines.json'), JSON.stringify(out));
