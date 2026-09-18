import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
}

export default async (req, context) => {
  const store = getStore({ name: 'profiles', consistency: 'strong' });
  const user = context?.user;

  if (!user?.sub) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const key = `user:${user.sub}`;

  if (req.method === 'GET') {
    const data = await store.get(key, { type: 'json' });
    return json(data || {});
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const existing = (await store.get(key, { type: 'json' })) || {};
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
    await store.setJSON(key, updated);
    return json(updated);
  }

  return json({ error: 'Method not allowed' }, 405);
};
