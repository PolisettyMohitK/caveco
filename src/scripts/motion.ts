import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Full motion for everyone, regardless of the OS "reduce motion" setting (client decision).
// To respect that setting again: window.matchMedia('(prefers-reduced-motion: reduce)').matches
const reduced = false;
document.documentElement.classList.remove('no-js');

const EASE = 'power3.out';
const DUR = 0.8;
const isMobile = () => window.innerWidth < 900;

// ---------- Smooth scroll ----------
// lerp mode = continuous momentum (glides to a stop instead of following a fixed curve)
const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
(window as any).__lenis = lenis;
(window as any).ScrollTriggerRefresh = () => ScrollTrigger.refresh();

export const lockScroll = (on: boolean) => {
  on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? 'hidden' : '';
};
export const scrollToEl = (el: Element | string) => lenis.scrollTo(el as any, { offset: -90 });

// ---------- Sky: deepens as you scroll, clouds drift at different depths ----------
function initSky() {
  const deep = document.querySelector('.sky-deep');
  if (deep) {
    gsap.to(deep, { opacity: 0.9, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
  }
  gsap.utils.toArray<HTMLElement>('.cloud').forEach((c) => {
    const depth = parseFloat(c.dataset.depth || '1');
    gsap.to(c, { y: () => -window.innerHeight * 0.5 * depth, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
  });
}

// ---------- Reveal: fade + rise ----------
function initReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    gsap.to(el, {
      opacity: 1, y: 0, duration: DUR, ease: EASE, delay: parseFloat(el.dataset.delay || '0'),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

// ---------- The Opening: an image revealed through a widening window ----------
export const R = 'clamp(18px, 2vw, 26px)'; // matches --r-lg
const rad = () => (isMobile() ? '18px' : '26px');

function initOpenings() {
  gsap.utils.toArray<HTMLElement>('[data-opening]').forEach((el) => {
    if (el.dataset.opened) return;
    el.dataset.opened = '1';
    const img = el.querySelector('img, video');
    if (el.dataset.opening === 'scrub') {
      const end = el.dataset.to || `inset(0px 0px 0px 0px round ${rad()})`;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el.dataset.trigger || el, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      });
      const from = (isMobile() && el.dataset.fromMobile) || el.dataset.from;
      const to = (isMobile() && el.dataset.toMobile) || end;
      tl.fromTo(el, { clipPath: from }, { clipPath: to, ease: 'power1.inOut', duration: 0.8 }, 0);
      if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', duration: 0.8 }, 0);
      tl.to({}, { duration: 0.2 });
    } else {
      gsap.set(el, { clipPath: `inset(10% 10% 10% 10% round ${rad()})` });
      if (img) gsap.set(img, { scale: 1.15 });
      const st = { trigger: el, start: 'top 88%', once: true };
      gsap.to(el, { clipPath: `inset(0% 0% 0% 0% round ${rad()})`, duration: 1.2, ease: 'power3.inOut', scrollTrigger: st, clearProps: 'clipPath' });
      if (img) gsap.to(img, { scale: 1, duration: 1.6, ease: EASE, scrollTrigger: st });
    }
  });
}

// ---------- Count-up numbers ----------
function initCounts() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const to = parseFloat(el.dataset.count || '0');
    const pad = parseInt(el.dataset.pad || '0', 10);
    const fmt = (v: number) => String(Math.round(v)).padStart(pad, '0');
    const o = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(o, {
      v: to, duration: 1.6, ease: 'power2.out',
      onUpdate: () => (el.textContent = fmt(o.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

// ---------- Spring feel (like iOS) ----------
// 1. Rubber band: push past the top or bottom and the page stretches, then springs back.
// 2. Islands lag a little behind fast scrolling and settle on a spring.
// Only plain sections move; anything holding a pinned or fixed element is left alone,
// and every offset is cleared to `translate: none` at rest so pins keep working.
function initSpring() {
  type Item = { el: HTMLElement; top: number; h: number; y: number; v: number; lag: boolean };
  let items: Item[] = [];
  const collect = () => {
    const els = [...document.querySelectorAll<HTMLElement>('main > *, body > footer')]
      .filter((el) => getComputedStyle(el).position !== 'fixed');
    items = els.map((el) => {
      const r = el.getBoundingClientRect();
      const lag = !el.hasAttribute('data-nospring') && !el.querySelector('.pin-spacer') && el.id !== 'hero';
      return { el, top: r.top + lenis.scroll, h: r.height, y: 0, v: 0, lag };
    });
  };

  let band = 0, bandV = 0, lastWheel = 0, lastScroll = 0;
  const atEdge = (dy: number) => (dy < 0 && lenis.scroll <= 0.5) || (dy > 0 && lenis.scroll >= lenis.limit - 0.5);
  window.addEventListener('wheel', (e) => {
    if (lenis.isStopped || document.documentElement.classList.contains('intro-on')) return;
    if ((e.target as Element)?.closest?.('[data-lenis-prevent]')) return;
    if (!atEdge(e.deltaY)) return;
    const room = 1 - Math.min(1, Math.abs(band) / 150);
    band += -Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.3 * room;
    bandV = 0;
    lastWheel = performance.now();
  }, { passive: true });
  // Arriving at an edge with speed gives a small bounce too
  lenis.on('scroll', () => {
    const s = lenis.scroll, v = lenis.velocity;
    if (Math.abs(v) > 3 && ((s <= 0.5 && lastScroll > 0.5) || (s >= lenis.limit - 0.5 && lastScroll < lenis.limit - 0.5))) {
      bandV += -Math.sign(v) * Math.min(Math.abs(v), 40) * 0.5;
    }
    lastScroll = s;
  });

  gsap.ticker.add(() => {
    if (!items.length) return;
    // Rubber band springs back once the wheel lets go
    if (performance.now() - lastWheel > 90) {
      bandV += -band * 0.13;
      bandV *= 0.7;
      band += bandV;
      if (Math.abs(band) < 0.05 && Math.abs(bandV) < 0.05) band = bandV = 0;
    }
    const vh = window.innerHeight;
    const vel = lenis.isStopped ? 0 : lenis.velocity;
    const amp = isMobile() ? 0.35 : 0.6;
    for (const it of items) {
      const top = it.top - lenis.scroll;
      const visible = top < vh + 100 && top + it.h > -100;
      let target = 0;
      if (it.lag && visible) {
        // Islands lower on screen trail a little more, like a stack of cards on springs
        const pos = Math.min(1, Math.max(0, (top + Math.min(it.h, vh) / 2) / vh));
        target = Math.max(-34, Math.min(34, vel * amp * (0.6 + pos * 0.8)));
      }
      it.v += (target - it.y) * 0.12;
      it.v *= 0.74;
      it.y += it.v;
      if (Math.abs(it.y) < 0.05 && Math.abs(it.v) < 0.05) it.y = it.v = 0;
      const total = it.y + band;
      const next = Math.abs(total) < 0.05 ? '' : `0 ${total.toFixed(2)}px`;
      if (it.el.style.translate !== next) it.el.style.translate = next;
    }
  });

  ScrollTrigger.addEventListener('refresh', collect);
  window.addEventListener('resize', () => requestAnimationFrame(collect));
  requestAnimationFrame(collect);
}

// ---------- Anchor links go through Lenis ----------
function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      scrollToEl(t);
    });
  });
}

export { gsap, ScrollTrigger, reduced, EASE, DUR, isMobile };

initSky();
initAnchors();
initReveals();
initOpenings();
initCounts();
initSpring();
window.addEventListener('load', () => ScrollTrigger.refresh());
