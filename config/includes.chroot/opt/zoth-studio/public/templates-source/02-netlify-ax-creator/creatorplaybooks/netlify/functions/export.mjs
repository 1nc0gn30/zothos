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
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const user = context?.user;
  if (!user?.sub) return json({ error: 'Unauthorized. Add Authorization: Bearer token from Netlify Identity.' }, 401);

  const store = getStore({ name: 'profiles', consistency: 'strong' });
  const key = `user:${user.sub}`;

  if (req.method === 'GET') {
    const data = await store.get(key, { type: 'json' });
    return json({
      user: { email: user.email, id: user.sub },
      profile: data || null,
      publicUrl: `https://mayagrowth.app/u/${(data?.handle || '').replace('@', '')}`,
    });
  }

  return json({ error: 'Method not allowed' }, 405);
};
