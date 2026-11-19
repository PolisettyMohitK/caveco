// Contact + brand facts. Phones, WhatsApp, Instagram and the hub come from
// src/content/settings.json (editable in the CMS).
import settings from '../content/settings.json';
const s = settings as { phones: string[]; whatsapp: string; instagram: string; hub: { name: string; area: string } };
if (!s.phones?.length || !/^\d{10,15}$/.test(s.whatsapp || '')) {
  throw new Error('Content error in src/content/settings.json: add at least one phone, and the WhatsApp number as digits only with country code (e.g. 918897757221).');
}
export const site = {
  name: 'Cave Co.',
  tagline: 'Prefab farmhouses, built in 90 days.',
  phones: s.phones,
  whatsapp: s.whatsapp,
  instagram: s.instagram,
  hub: s.hub,
  hubs: [
    { city: 'Hyderabad', name: 'Experience Hub', area: 'Sainikpuri', address: 'Sainikpuri, Secunderabad — TODO(client): full address' },
    { city: 'Visakhapatnam', name: 'Studio', area: 'Vizag', address: 'TODO(client): address' },
  ],
  enquiryEndpoint: '/api/enquire', // Cloudflare Pages Function in /functions/api/enquire.ts
  // Hero film. Until the client sends a clip, the card plays these stills as a slow slideshow.
  heroFilm: {
    src: '', // TODO(client): short muted loop, e.g. /media/film/orion.mp4
    title: 'Walk through Orion',
    frames: ['/media/ig/orion-ext-1.webp', '/media/ig/orion-int-3.webp', '/media/ig/orion-int-10.webp', '/media/ig/orion-ext-5.webp'],
  },
};

/**
 * Crop an image inside a .frame without using transforms (GSAP owns transforms).
 * zoom = how much to enlarge; x/y = focal point 0..1 (like transform-origin).
 * Used to hide text baked into Instagram posts.
 */
export const cropStyle = (zoom: number, x = 0.5, y = 0.5) =>
  `position:absolute;max-width:none;width:${zoom * 100}%;height:${zoom * 100}%;` +
  `left:${-(zoom - 1) * x * 100}%;top:${-(zoom - 1) * y * 100}%`;

export const waLink = (text = "Hi Cave Co, I'd like to talk about a farmhouse.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
