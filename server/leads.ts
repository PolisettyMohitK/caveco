// Shared lead logic for the Cloudflare Pages Functions in /functions.
// Kept outside /functions so it doesn't become a route.

// Minimal D1 types, so we don't need @cloudflare/workers-types
export interface D1Result<T = Record<string, unknown>> { results: T[] }
export interface D1Stmt {
  bind(...v: unknown[]): D1Stmt;
  run(): Promise<unknown>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
export interface D1 { prepare(sql: string): D1Stmt }

export interface Env {
  LEADS?: D1;                 // D1 database binding (see wrangler.toml)
  ADMIN_TOKEN?: string;       // password for /admin/leads and /api/leads
  RESEND_API_KEY?: string;    // optional: email each lead via resend.com
  LEAD_EMAIL_TO?: string;     // comma-separated addresses
  LEAD_EMAIL_FROM?: string;   // e.g. "Cave Co. Website <leads@thecaveco.in>" (domain verified in Resend)
  LEAD_WEBHOOK_URL?: string;  // optional: POST each lead as JSON (Google Sheet script, CRM, Zapier…)
  IP_SALT?: string;           // any random string; IPs are stored only as salted hashes
}

export type Lead = {
  id: string; created_at: string;
  name: string; phone: string; email: string | null; location: string;
  plot: string | null; start_when: string | null; model: string | null; message: string | null; whatsapp: number;
  page: string | null; referrer: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
  country: string | null; city: string | null; ip_hash: string | null; status: string;
};

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

const clip = (v: unknown, max: number) => {
  if (v === undefined || v === null) return null;
  const s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  return s ? s.slice(0, max) : null;
};

/** Indian numbers: 10 digits (optionally with 0 / 91 in front) become +91XXXXXXXXXX. */
export const normalisePhone = (raw: string) => {
  const d = raw.replace(/\D/g, '');
  if (d.length === 10) return `+91${d}`;
  if (d.length === 11 && d.startsWith('0')) return `+91${d.slice(1)}`;
  if (d.length === 12 && d.startsWith('91')) return `+${d}`;
  if (d.length >= 10 && d.length <= 15) return `+${d}`;
  return null;
};

export type Clean = Omit<Lead, 'id' | 'created_at' | 'country' | 'city' | 'ip_hash' | 'status'>;

/** Validate and tidy the form body. Returns the clean lead or a list of fields that are wrong. */
export const clean = (b: Record<string, unknown>): { ok: true; lead: Clean } | { ok: false; fields: string[] } => {
  const fields: string[] = [];
  const name = clip(b.name, 120);
  const phone = normalisePhone(String(b.phone ?? ''));
  const location = clip(b.location, 200);
  let email = clip(b.email, 200);
  if (!name || name.length < 2) fields.push('name');
  if (!phone) fields.push('phone');
  if (!location || location.length < 2) fields.push('location');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) email = null; // optional: drop a bad one rather than reject
  if (fields.length) return { ok: false, fields };
  const wa = b.wa;
  return {
    ok: true,
    lead: {
      name: name!, phone: phone!, email, location: location!,
      plot: clip(b.plot, 60), start_when: clip(b.when, 60), model: clip(b.model, 60), message: clip(b.message, 2000),
      whatsapp: wa === false || wa === 'false' || wa === '0' || wa === undefined ? 0 : 1,
      page: clip(b.page, 300), referrer: clip(b.referrer, 300),
      utm_source: clip(b.utm_source, 100), utm_medium: clip(b.utm_medium, 100), utm_campaign: clip(b.utm_campaign, 100),
    },
  };
};

export const sha256 = async (s: string) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
};

/** Constant-time string compare for the admin token. */
export const sameSecret = (a: string, b: string) => {
  if (!a || !b || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

export const isAdmin = (req: Request, env: Env) => {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  return !!env.ADMIN_TOKEN && sameSecret(token, env.ADMIN_TOKEN);
};

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const rows = (l: Lead) => [
  ['Name', l.name], ['Phone', l.phone], ['Email', l.email], ['Land', l.location], ['Plot size', l.plot],
  ['Start', l.start_when], ['Model', l.model], ['Message', l.message], ['WhatsApp OK', l.whatsapp ? 'Yes' : 'No'],
  ['Page', l.page], ['Source', [l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(' / ') || l.referrer],
  ['From', [l.city, l.country].filter(Boolean).join(', ')], ['Received', l.created_at], ['Lead ID', l.id],
].filter(([, v]) => v) as [string, string][];

/** Email the team about a new lead (Resend). Returns true when sent. */
export const sendEmail = async (env: Env, l: Lead) => {
  if (!env.RESEND_API_KEY || !env.LEAD_EMAIL_TO || !env.LEAD_EMAIL_FROM) return false;
  const wa = `https://wa.me/${l.phone.replace(/\D/g, '')}`;
  const html = `<div style="font-family:system-ui,sans-serif;color:#1e1c19">
    <h2 style="color:#5a3a24;margin:0 0 12px">New enquiry: ${esc(l.name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows(l).map(([k, v]) => `<tr><td style="color:#777;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>
    <p style="margin-top:16px"><a href="tel:${esc(l.phone)}">Call</a> · <a href="${esc(wa)}">WhatsApp</a></p></div>`;
  const text = rows(l).map(([k, v]) => `${k}: ${v}`).join('\n');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_EMAIL_FROM, to: env.LEAD_EMAIL_TO.split(',').map((s) => s.trim()).filter(Boolean),
      subject: `New enquiry: ${l.name}${l.model ? ` (${l.model})` : ''}`, html, text,
      ...(l.email ? { reply_to: l.email } : {}),
    }),
  });
  return r.ok;
};

/** POST the lead to a webhook (Google Sheet Apps Script, CRM, Zapier…). Returns true when accepted. */
export const sendWebhook = async (env: Env, l: Lead) => {
  if (!env.LEAD_WEBHOOK_URL) return false;
  const { ip_hash, ...pub } = l; // never send the IP hash out
  const r = await fetch(env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(pub), redirect: 'follow' });
  return r.ok;
};

export const toCsv = (list: Lead[]) => {
  const cols: (keyof Lead)[] = ['created_at', 'status', 'name', 'phone', 'email', 'location', 'plot', 'start_when', 'model', 'message', 'whatsapp', 'page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'city', 'country', 'id'];
  const cell = (v: unknown) => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...list.map((l) => cols.map((c) => cell(l[c])).join(','))].join('\r\n');
};
