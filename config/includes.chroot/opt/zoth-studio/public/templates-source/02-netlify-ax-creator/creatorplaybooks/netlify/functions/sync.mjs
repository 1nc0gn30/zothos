import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
}

// No X API key yet — this function uses public proxies where possible and returns draft state.
async function syncCreator(handle) {
  // unavatar is a reliable public avatar resolver
  const avatar = `https://unavatar.io/twitter/${handle}?fallback=false`;
  return {
    handle,
    syncedAt: new Date().toISOString(),
    source: 'unavatar-only',
    avatar,
    posts: [],
    media: [],
    followers: 0,
    bio: '',
  };
}

export default async (req, context) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const url = new URL(req.url);
  const path = url.pathname.replace('/api/', '');
  const store = getStore({ name: 'creator-sync', consistency: 'strong' });

  // POST /api/sync?handle=buildwithmaya
  if (path === 'sync' && req.method === 'POST') {
    const handle = url.searchParams.get('handle') || url.searchParams.get('id');
    if (!handle) return json({ error: 'Missing handle query param' }, 400);
    try {
      const data = await syncCreator(handle);
      await store.set(handle, data, { type: 'json' });
      return json({ ok: true, handle, syncedAt: data.syncedAt, note: 'Limited public sync. Add X_API_BEARER env var for full posts/media.' });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  // GET /api/sync-status
  if (path === 'sync-status' && req.method === 'GET') {
    const handles = ['buildwithmaya', 'thisiskp_', 'zeng_wt', 'halfmage', 'ChaiWithJai', 'NealFrazierTech'];
    const results = await Promise.all(handles.map(async (h) => {
      const data = await store.get(h, { type: 'json' }).catch(() => null);
      return { handle: h, lastSync: data?.syncedAt || null, source: data?.source || 'never' };
    }));
    return json({ count: results.length, results });
  }

  return json({ error: 'Not found', available: ['sync?handle=...', 'sync-status'] }, 404);
};
