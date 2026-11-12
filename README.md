# Cave Co. website

Astro + GSAP + Lenis. Static output, deploy `dist/` anywhere (Netlify, Vercel, Cloudflare Pages).

```
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
```

Animations run for every visitor, even if their OS has "reduce motion" on (client decision). To respect that setting again, change `reduced` in `src/scripts/motion.ts`.

## Where things live
- `src/data/` — all content: models, projects, steps, FAQ, contact. Add a model or project here.
- `src/styles/global.css` — colours, type, spacing tokens.
- `src/scripts/motion.ts` — smooth scroll + reveal / opening / count-up animations.
- `public/media/ig/` — photos taken from @the_cave_co (temporary, replace with originals).

## Design system
- Theme comes from the Instagram profile picture: a sky behind everything, with each section a white "island" floating on it. The sky deepens as you scroll; clouds drift at different depths.
- Colours: black `#0B0B0C` and white, sky blues for the backdrop and soft surfaces (`--sky-*`), blueprint blue for plan panels. Red `#E2412B` appears only on hover.
- Buttons are white with a black outline; on hover they turn red and round into a pill.
- Type: Geist for everything (both headline lines in the same style), Montserrat Bold for the mock CAVE CO. wordmark.
- Signature moves: **the Opening** (photo revealed through a widening window), **the day counter**, **the floor-plan morph** (big house simplifying into a Cave plan), **the project log** that opens each project as a newsletter issue.
- Projects live in `src/data/projects.ts` as "pieces" (photo, film, headline, tagline, text, quote, facts) that lay out as a collage.

## Needs from the client (search `TODO(client)`)
- Model names, sizes, rooms, prices, build days. Third model.
- Original high-res photos (IG copies are 1440px and some have text baked in — Studio Pod render, steel frame).
- Real floor plans (plans are placeholder rectangles).
- Owner quotes, Orion story details, photo credits.
- Experience Hub full address, Vizag address, regions served.
- FAQ answers: monsoon rating, coating spec, design life, warranty, financing.
- Enquiry form endpoint (`src/data/site.ts → enquiryEndpoint`) and newsletter provider.
- Short looping videos to replace stills (hero, room tour).
