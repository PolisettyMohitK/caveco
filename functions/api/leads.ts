// /api/leads — private. Needs "Authorization: Bearer <ADMIN_TOKEN>".
//   GET  ?format=json|csv&status=new|contacted|closed&q=search   → list leads (newest first)
//   PATCH { id, status }                                          → update a lead's status
import { isAdmin, json, toCsv, type Env, type Lead } from '../../server/leads';

type Ctx = { request: Request; env: Env };
const STATUSES = ['new', 'contacted', 'closed'];

const guard = ({ request, env }: Ctx) => {
  if (!env.ADMIN_TOKEN) return json({ ok: false, error: 'admin_not_configured' }, 503);
  if (!isAdmin(request, env)) return json({ ok: false, error: 'unauthorised' }, 401);
  if (!env.LEADS) return json({ ok: false, error: 'db_not_configured' }, 503);
  return null;
};

export const onRequestGet = async (ctx: Ctx) => {
  const denied = guard(ctx);
  if (denied) return denied;
  const u = new URL(ctx.request.url);
  const status = u.searchParams.get('status');
  const q = (u.searchParams.get('q') || '').trim().slice(0, 100);
  const where: string[] = [];
  const args: unknown[] = [];
  if (status && STATUSES.includes(status)) { where.push('status = ?'); args.push(status); }
  if (q) { where.push('(name LIKE ? OR phone LIKE ? OR location LIKE ? OR model LIKE ?)'); const like = `%${q}%`; args.push(like, like, like, like); }
  const sql = `SELECT * FROM leads ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT 5000`;
  const { results } = await ctx.env.LEADS!.prepare(sql).bind(...args).all<Lead>();
  const list = results.map(({ ip_hash, ...l }) => l as Lead);

  if (u.searchParams.get('format') === 'csv') {
    const day = new Date().toISOString().slice(0, 10);
    return new Response('﻿' + toCsv(list), { headers: {
      'content-type': 'text/csv; charset=utf-8', 'cache-control': 'no-store',
      'content-disposition': `attachment; filename="cave-co-leads-${day}.csv"`,
    } });
  }
  return json({ ok: true, leads: list });
};

export const onRequestPatch = async (ctx: Ctx) => {
  const denied = guard(ctx);
  if (denied) return denied;
  let b: { id?: string; status?: string };
  try { b = await ctx.request.json(); } catch { return json({ ok: false, error: 'bad_body' }, 400); }
  if (!b.id || !b.status || !STATUSES.includes(b.status)) return json({ ok: false, error: 'invalid' }, 422);
  await ctx.env.LEADS!.prepare('UPDATE leads SET status = ? WHERE id = ?').bind(b.status, b.id).run();
  return json({ ok: true });
};

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { allow: 'GET, PATCH' });
