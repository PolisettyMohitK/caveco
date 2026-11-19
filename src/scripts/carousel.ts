// Spring carousel: drag or swipe a row of cards; on release it glides and settles on a card
// with real spring physics (overshoots a touch, then rests), like iOS.
// Markup: <div data-carousel><div data-track> ...cards... </div></div>
// Optional: [data-prev] / [data-next] buttons and [data-dots] inside the carousel root.

type Opts = { onChange?: (i: number) => void };

export function carousel(root: HTMLElement, opts: Opts = {}) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const slides = [...track.children] as HTMLElement[];
  const dots = root.querySelector<HTMLElement>('[data-dots]');
  let x = 0, v = 0, target = 0, index = 0;
  let dragging = false, startX = 0, startY = 0, lastX = 0, lastT = 0, moved = false, axis: 'x' | 'y' | null = null;
  let raf = 0, from = 0, lastFrame = 0;

  const stops = () => {
    const max = Math.max(0, track.scrollWidth - root.clientWidth);
    const pad = slides[0]?.offsetLeft ?? 0;
    return { list: slides.map((s) => Math.min(max, Math.max(0, s.offsetLeft - pad))), max };
  };
  const nearest = (pos: number) => {
    const { list } = stops();
    let best = 0;
    list.forEach((p, i) => { if (Math.abs(p - pos) < Math.abs(list[best] - pos)) best = i; });
    return best;
  };
  const paint = () => { track.style.transform = `translate3d(${-x}px,0,0)`; };
  const setIndex = (i: number) => {
    if (i === index) return;
    index = i;
    dots?.querySelectorAll('button').forEach((d, k) => d.classList.toggle('on', k === i));
    root.querySelector<HTMLButtonElement>('[data-prev]')?.toggleAttribute('disabled', i === 0);
    root.querySelector<HTMLButtonElement>('[data-next]')?.toggleAttribute('disabled', i === slides.length - 1);
    opts.onChange?.(i);
  };

  // Spring, timed in seconds so it feels the same on 60Hz and 120Hz screens.
  // Low stiffness = slow, soft glide; damping just under 1 = settles with the faintest breath.
  const W = 6.2, Z = 0.86; // natural frequency (rad/s), damping ratio
  const tick = (now: number) => {
    const dt = Math.min(0.032, (now - (lastFrame || now - 16)) / 1000);
    lastFrame = now;
    // two half-steps keep it stable
    for (let s = 0; s < 2; s++) {
      const h = dt / 2;
      v += (W * W * (target - x) - 2 * Z * W * v) * h;
      x += v * h;
    }
    paint();
    if (Math.abs(v) > 4 || Math.abs(target - x) > 0.4) raf = requestAnimationFrame(tick);
    else { x = target; v = 0; paint(); raf = 0; }
  };
  const start = () => { if (!raf) { lastFrame = 0; raf = requestAnimationFrame(tick); } };
  const go = (i: number, kick = 0) => {
    const { list } = stops();
    i = Math.max(0, Math.min(slides.length - 1, i));
    target = list[i];
    v = kick;
    setIndex(i);
    start();
  };

  // ---- Drag / swipe ----
  const off = () => root.hasAttribute('data-off'); // e.g. when the row is scroll-driven instead
  root.addEventListener('pointerdown', (e) => {
    if (off()) return;
    if ((e.target as Element).closest('button, a, input')) return;
    dragging = true; moved = false; axis = null; from = index;
    startX = lastX = e.clientX; startY = e.clientY; lastT = performance.now(); v = 0;
    cancelAnimationFrame(raf); raf = 0;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    if (!axis) {
      const ax = Math.abs(e.clientX - startX), ay = Math.abs(e.clientY - startY);
      if (ax < 6 && ay < 6) return;
      axis = ax > ay ? 'x' : 'y';
      if (axis === 'x') root.setPointerCapture?.(e.pointerId);
    }
    if (axis !== 'x') return;
    moved = true;
    const { max } = stops();
    // Rubber band past the ends
    const over = x < 0 || x > max;
    x -= over ? dx * 0.35 : dx;
    const now = performance.now();
    // px per second, smoothed so one jittery sample can't fling it
    const inst = (-dx / Math.max(1, now - lastT)) * 1000;
    v = v * 0.6 + inst * 0.4;
    lastX = e.clientX; lastT = now;
    paint();
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    if (axis !== 'x') return;
    // Throw: project where the flick would carry it, then pick that card
    if (performance.now() - lastT > 80) v = 0; // finger rested before lifting: no throw
    const projected = x + v * 0.22;
    let i = nearest(projected);
    if (i === from && Math.abs(v) > 350) i += v > 0 ? 1 : -1;
    // One card per swipe, like paging on iOS
    i = Math.max(from - 1, Math.min(from + 1, i));
    // carry only part of the finger's speed so the glide starts calm
    go(i, Math.max(-1600, Math.min(1600, v * 0.35)));
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  // Swallow the click that ends a drag so cards don't open by accident
  root.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  root.style.touchAction = 'pan-y';

  // Trackpad sideways scroll
  let wheelT = 0;
  root.addEventListener('wheel', (e) => {
    if (off() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    const { max } = stops();
    cancelAnimationFrame(raf); raf = 0;
    x = Math.max(-40, Math.min(max + 40, x + e.deltaX));
    paint();
    clearTimeout(wheelT);
    wheelT = window.setTimeout(() => go(nearest(x)), 120);
  }, { passive: false });

  root.querySelector('[data-prev]')?.addEventListener('click', () => go(index - 1));
  root.querySelector('[data-next]')?.addEventListener('click', () => go(index + 1));
  dots?.querySelectorAll('button').forEach((d, k) => d.addEventListener('click', () => go(k)));
  window.addEventListener('resize', () => { if (off()) return; x = target = stops().list[index]; paint(); });

  index = -1; setIndex(0);
  return { go, get index() { return index; } };
}
