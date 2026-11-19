// POST /api/enquire — receives the enquiry form, stores the lead in D1, then emails the team
// and/or posts to a webhook (whichever is configured). Cloudflare Pages Function.
import { clean, json, sha256, sendEmail, sendWebhook, type Env, type Lead } from '../../server/leads';

type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

const MAX_PER_IP = 5;     // enquiries per IP…
const WINDOW_MIN = 10;    // …per this many minutes
const MIN_FILL_MS = 2500; // humans take longer than this to fill the form

export const onRequestPost = async ({ request, env, waitUntil }: Ctx) => {
  // Same-site only (blocks other sites posting into the form)
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, error: 'origin' }, 403);

  let body: Record<string, unknown>;
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) body = await request.json();
    else body = Object.fromEntries((await request.formData()).entries()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'bad_body' }, 400);
  }

  // Spam traps: a hidden field people never fill, and a too-fast submit. Pretend success.
  const started = Number(body.t);
  if (String(body.company ?? '').trim() || (started && Date.now() - started < MIN_FILL_MS)) return json({ ok: true, id: 'ok' });

  const c = clean(body);
  if (!c.ok) return json({ ok: false, error: 'invalid', fields: c.fields }, 422);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const ipHash = ip ? (await sha256(`${env.IP_SALT || 'caveco'}:${ip}`)).slice(0, 32) : null;
  const cf = (request as unknown as { cf?: { country?: string; city?: string } }).cf;
  const lead: Lead = {
    ...c.lead, id: crypto.randomUUID(), created_at: new Date().toISOString(),
    country: cf?.country ?? null, city: cf?.city ?? null, ip_hash: ipHash, status: 'new',
  };

  let stored = false;
  if (env.LEADS) {
    try {
      const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
      if (ipHash) {
        const n = await env.LEADS.prepare('SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ? AND created_at > ?').bind(ipHash, since).first<{ n: number }>();
        if ((n?.n ?? 0) >= MAX_PER_IP) return json({ ok: false, error: 'rate_limited' }, 429);
      }
      // Double-click or resend of the same enquiry: don't store or notify twice
      const dupe = await env.LEADS.prepare('SELECT id FROM leads WHERE phone = ? AND created_at > ? LIMIT 1').bind(lead.phone, since).first<{ id: string }>();
      if (dupe) return json({ ok: true, id: dupe.id, duplicate: true });

      await env.LEADS.prepare(
        `INSERT INTO leads (id, created_at, name, phone, email, location, plot, start_when, model, message, whatsapp,
          page, referrer, utm_source, utm_medium, utm_campaign, country, city, ip_hash, status)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        lead.id, lead.created_at, lead.name, lead.phone, lead.email, lead.location, lead.plot, lead.start_when, lead.model, lead.message, lead.whatsapp,
        lead.page, lead.referrer, lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.country, lead.city, lead.ip_hash, lead.status,
      ).run();
      stored = true;
    } catch (e) {
      console.error('lead insert failed', e);
    }
  }

  const notify = () => Promise.allSettled([sendEmail(env, lead), sendWebhook(env, lead)])
    .then((r) => r.some((x) => x.status === 'fulfilled' && x.value));

  if (stored) {
    // Saved: notifications can finish after we reply
    waitUntil(notify().catch((e) => console.error('lead notify failed', e)));
    return json({ ok: true, id: lead.id });
  }
  // Not saved (no database yet, or it failed): only report success if a notification got through
  const sent = await notify().catch(() => false);
  if (sent) return json({ ok: true, id: lead.id });
  return json({ ok: false, error: 'not_configured' }, 503);
};

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { allow: 'POST' });
