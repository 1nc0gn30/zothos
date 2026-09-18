import type { Context } from '@netlify/functions';

export interface StoredProgress {
  completed: string[];
  updatedAt: string;
  clientVersion: string;
}

const BUCKET_PREFIX = 'dogfooding-gameplan:';
const ALLOWED = ['GET', 'POST', 'DELETE', 'OPTIONS'] as const;

export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  const userId = (url.searchParams.get('userId') || 'default').slice(0, 64);
  const { Blobs } = await import('@netlify/blobs');

  try {
    // Preflight
    if (!ALLOWED.includes(req.method as typeof ALLOWED[number])) {
      return response(405, { error: `Method not allowed. Allowed: ${ALLOWED.join(', ')}` });
    }
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: preflightHeaders(ALLOWED.join(', ')) });
    }

    // Initialize store (idempotent — Netlify creates bucket on first write)
    const store = Blobs.forSite(ctx.site?.siteId, ctx.site?.token).setStore({
      name: 'gameplan-progress',
    });
    await selfHealBucket(store);

    if (req.method === 'GET') {
      const raw = await store.get(`${BUCKET_PREFIX}${userId}`, { type: 'text' });
      const data: StoredProgress = raw ? JSON.parse(raw) : { completed: [], updatedAt: '', clientVersion: '0' };
      return response(200, data);
    }

    if (req.method === 'DELETE') {
      await store.delete(`${BUCKET_PREFIX}${userId}`);
      return response(200, { ok: true, message: 'Progress reset' });
    }

    // POST
    let body: Partial<StoredProgress>;
    try {
      body = (await req.json()) as Partial<StoredProgress>;
    } catch {
      return response(400, { error: 'Body must be JSON' });
    }

    const completed = Array.isArray(body.completed) ? body.completed.slice(0, 128) : [];
    const entry: StoredProgress = {
      completed,
      updatedAt: new Date().toISOString(),
      clientVersion: (body.clientVersion ?? '0').toString().slice(0, 16),
    };
    await store.setJSON(`${BUCKET_PREFIX}${userId}`, entry);
    return response(200, entry);
  } catch (err) {
    console.error('[gameplan-sync] unhandled', err);
    return response(500, { error: 'Internal server error', fallback: 'Continuing with local storage.' });
  }
};

// ---- Self-healing: verify bucket reachable, write health marker if missing ----
async function selfHealBucket(store: { get: (key: string, opts?: { type: string }) => Promise<string | null> }) {
  try {
    await store.get('__ready__', { type: 'text' });
  } catch {
    console.warn('[gameplan-sync] bucket not yet initialised — will create on next write');
  }
}

function response(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      ...preflightHeaders('GET, POST, DELETE, OPTIONS'),
    },
  });
}

function preflightHeaders(allowMethods: string) {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': allowMethods,
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
  };
}