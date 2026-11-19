export const steps = [
  { day: 0, end: 3, title: 'First call', body: 'Tell us about your land and how you want to use it. Weekend home, rental, or both.', img: '/media/ig/orion-int-2.webp' },
  { day: 4, end: 10, title: 'Site visit', body: 'We walk the plot with you. Soil, slope, sun, access and water.', img: '/media/ig/orion-ext-4.webp' },
  { day: 11, end: 21, title: 'Design and price', body: 'Pick a model and finish. You get drawings, 3D views and one fixed price.', img: '/media/ig/orion-int-3.webp' },
  { day: 22, end: 35, title: 'Approvals', body: 'We prepare the paperwork and follow it up, so you don’t have to.', img: '/media/ig/hub-1.jpg', style: 'object-position:50% 62%' },
  { day: 36, end: 70, title: 'Factory', body: 'Frame and panels are made in our factory while the foundation goes in on site.', img: '/media/ig/misc-1.webp', crop: true },
  { day: 71, end: 88, title: 'Install', body: 'Panels arrive, go up and get finished. Kitchen, baths, lights.', img: '/media/ig/orion-ext-3.webp' },
  { day: 89, end: 90, title: 'Keys', body: 'We walk you through the house. Then it’s yours.', img: '/media/ig/orion-ext-2.webp' },
];

export const trades = [
  'Architect', 'Structural engineer', 'Contractor', 'Mason', 'Fabricator', 'Electrician',
  'Plumber', 'Carpenter', 'Painter', 'Interior designer', 'Liaison agent', 'Site supervisor',
];

// FAQ comes from src/content/faq.json (editable in the CMS).
import faqJson from '../content/faq.json';
export const faq: { q: string; a: string }[] = (faqJson as { questions: { q: string; a: string }[] }).questions
  .filter((x) => x.q?.trim() && x.a?.trim());

// Real owner quotes only. The section stays hidden while this is empty. TODO(client)
export const quotes: { text: string; who: string; where: string }[] = [];
