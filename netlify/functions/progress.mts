import type { Config } from '@netlify/functions';
import { drizzle } from 'drizzle-orm/netlify-db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { learners } from '../../db/schema.js';
import { emptyProgress, isProgress } from '../../src/data.js';
export default async (req: Request) => {
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  if (!['GET', 'PUT'].includes(req.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, PUT' } });
  if (req.method === 'PUT' && req.headers.get('origin') !== new URL(req.url).origin) return new Response('Forbidden', { status: 403 });
  const cookie = req.headers.get('cookie')?.match(/(?:^|;\s*)essfmb=([a-f0-9-]{36})(?:;|$)/)?.[1];
  const id = cookie || randomUUID();
  headers.set('Set-Cookie', `essfmb=${id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${new URL(req.url).protocol === 'https:' ? '; Secure' : ''}`);
  try {
    const db = drizzle();
    if (req.method === 'GET') {
      const [row] = await db.select().from(learners).where(eq(learners.id, id));
      return Response.json(row?.progress || emptyProgress(), { headers });
    }
    const body = await req.text();
    if (body.length > 500000) return new Response('Backup is too large', { status: 413 });
    let progress: unknown;
    try { progress = JSON.parse(body); } catch { return new Response('Invalid JSON', { status: 400 }); }
    if (!isProgress(progress)) return new Response('Invalid progress data', { status: 400 });
    await db.insert(learners).values({ id, progress }).onConflictDoUpdate({ target: learners.id, set: { progress, updatedAt: new Date() } });
    return Response.json({ saved: true }, { headers });
  } catch {
    return Response.json({ error: 'Progress could not be saved. Please retry.' }, { status: 503, headers });
  }
};
export const config: Config = { path: '/api/progress' };
