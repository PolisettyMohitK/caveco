# Editing the Cave Co. site (CMS)

Open **https://caveco.pages.dev/cms/** and sign in. Change things, press **Save**, and the live
site updates about a minute later (Cloudflare rebuilds it from GitHub).

## What can be edited

| Section | What |
| --- | --- |
| **Models** | Name, type, area, bedrooms, toilets, price, collection, description, photos, room tabs, floor plan room names and sizes, model brochure. Add a new model with **New**. |
| **Pages → Landing page** | Hero, Highlights, photo band, Take a closer look, Orion photos, Why choose Cave Co., Our conscious promise. |
| **Site content** | Phone numbers, WhatsApp, Instagram, Experience Hub, company brochure, process steps, What is included, collections, add-ons, FAQ. |

- **Photos:** upload any JPG or PNG. It's resized for the web automatically. The existing renders sit in the `cottage`, `1bhk`, `2bhk` and `orion` folders and can be picked too.
- **Empty price:** leave it empty and the site shows a placeholder until it's set.
- **Safety net:** every save is checked at build time. If something is missing (for example a photo was deleted), the build stops and the live site stays as it was. The reason appears in Cloudflare → caveco → Deployments.
- **Undo:** every change is a commit on GitHub, so any version can be restored.
- **Floor plan outlines:** these are measured on the drawing. Rename rooms and change sizes freely, but ask the developer before changing the outline numbers or uploading a new plan.

## Signing in (one-time setup)

The editor needs a GitHub account with write access to `PolisettyMohitK/caveco`
(GitHub → repo → Settings → Collaborators → invite).

**Quick way: access token**
1. GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token.
2. Repository access: only `caveco`. Permissions: **Contents: Read and write**.
3. On `/cms/`, choose **Sign In Using Access Token** and paste it.

**Nicer way: "Sign in with GitHub" button**
1. Deploy the official auth worker: https://github.com/sveltia/sveltia-cms-auth (it has a "Deploy to Cloudflare" button).
2. Create a GitHub OAuth App (GitHub → Settings → Developer settings → OAuth Apps).
   - Homepage: `https://caveco.pages.dev`
   - Callback: `https://<worker-url>/callback`
3. In the worker's settings, add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `ALLOWED_DOMAINS=caveco.pages.dev`.
4. In `public/cms/config.yml`, uncomment `base_url:` and set it to the worker URL.

## For the developer

- Content lives in `src/content/*.json` and is validated in `src/data/models.ts`, `home.ts`, `site.ts` and `content.ts`.
- CMS uploads land in `public/media/`. `scripts/images.mjs` turns them into `public/_img/*` WebP files and `src/data/uploads.json` (it runs before `dev` and `build`).
- CMS saves commit straight to `main`, so run `git pull` before working locally.
