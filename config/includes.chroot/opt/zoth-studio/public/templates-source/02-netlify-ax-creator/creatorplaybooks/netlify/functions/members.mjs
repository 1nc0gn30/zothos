const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

import { getStore } from '@netlify/blobs';

const store = () => getStore({ name: 'creatorplaybooks', consistency: 'strong' });

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

async function readBody(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function text(blob) {
  if (!blob) return null;
  if (typeof blob === 'string') return blob;
  if (blob instanceof ArrayBuffer) return new TextDecoder().decode(blob);
  return null;
}

async function getMember(userId) {
  const blob = await store().get(`members:${userId}`);
  return text(blob);
}

async function getSubmissions() {
  const s = store();
  const list = await s.list({ prefix: 'submissions:' });
  const out = [];
  for (const item of list.blobs) {
    const blob = await s.get(item.key);
    const t = text(blob);
    if (t) out.push(JSON.parse(t));
  }
  return out;
}

async function getAllVoteSummaries() {
  const s = store();
  const list = await s.list({ prefix: 'votes:' });
  const out = {};
  for (const item of list.blobs) {
    const blob = await s.get(item.key);
    const t = text(blob);
    if (t) {
      const summary = JSON.parse(t);
      out[summary.creatorId] = summary;
    }
  }
  return out;
}

function buildDefaultProfile(user) {
  const safeName = user.name || user.email.split('@')[0] || 'Builder';
  const handle = safeName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'builder';
  return {
    id: user.id,
    email: user.email,
    name: safeName,
    handle,
    bio: 'Just a builder learning from the best playbooks.',
    avatar: '',
    banner: '',
    building: '',
    likedPlaybooks: [],
    admiredCreators: [],
    votes: {},
    role: 'member',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function upsertMember(user) {
  const existing = await getMember(user.id);
  if (existing) return JSON.parse(existing);
  const created = buildDefaultProfile(user);
  await store().setJSON(`members:${user.id}`, created);
  return created;
}

export default async (req, context) => {
  if (req.method === 'OPTIONS') return json({ ok: true });

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || url.pathname.split('/').pop();

  // Public: vote summaries
  if (action === 'votes') {
    const summaries = await getAllVoteSummaries();
    return json(summaries);
  }

  const user = context?.user;
  if (!user) return error('Unauthorized', 401);

  if (action === 'me') {
    if (req.method === 'GET') {
      const profile = await upsertMember(user);
      return json(profile);
    }
    if (req.method === 'POST' || req.method === 'PATCH') {
      const body = await readBody(req);
      const current = await upsertMember(user);
      const next = { ...current, ...body, id: current.id, email: current.email, role: current.role, updatedAt: new Date().toISOString() };
      await store().setJSON(`members:${user.id}`, next);
      return json(next);
    }
  }

  if (action === 'vote') {
    const body = await readBody(req);
    const { creatorId, direction } = body;
    if (!creatorId || !['up', 'down', null].includes(direction)) {
      return error('Invalid vote payload');
    }
    const profile = await upsertMember(user);
    const previous = profile.votes[creatorId] || null;
    profile.votes[creatorId] = direction;
    await store().setJSON(`members:${user.id}`, profile);

    const key = `votes:${creatorId}`;
    const blob = await store().get(key);
    const summary = text(blob) ? JSON.parse(text(blob)) : { creatorId, up: 0, down: 0, score: 0 };
    if (previous === 'up') summary.up = Math.max(0, summary.up - 1);
    if (previous === 'down') summary.down = Math.max(0, summary.down - 1);
    if (direction === 'up') summary.up += 1;
    if (direction === 'down') summary.down += 1;
    summary.score = summary.up - summary.down;
    await store().setJSON(key, summary);
    return json({ profile, summary });
  }

  if (action === 'submit') {
    const body = await readBody(req);
    if (!body.handle || !body.name || !body.category || !body.reason) {
      return error('Missing submission fields');
    }
    const payload = {
      ...body,
      id: crypto.randomUUID(),
      submittedBy: user.id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    await store().setJSON(`submissions:${payload.id}`, payload);
    return json(payload, 201);
  }

  if (action === 'submissions') {
    if (user.role !== 'admin') return error('Forbidden', 403);
    const subs = await getSubmissions();
    return json(subs);
  }

  if (action === 'moderate') {
    if (user.role !== 'admin') return error('Forbidden', 403);
    const body = await readBody(req);
    const { id, status } = body;
    if (!id || !['approved', 'rejected'].includes(status)) return error('Invalid moderation payload');
    const key = `submissions:${id}`;
    const blob = await store().get(key);
    const t = text(blob);
    if (!t) return error('Submission not found', 404);
    const sub = JSON.parse(t);
    sub.status = status;
    await store().setJSON(key, sub);
    return json(sub);
  }

  return error('Unknown action');
};

export const config = { path: '/api/members' };
