import netlifyIdentity from 'netlify-identity-widget';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  jwt: (force?: boolean) => Promise<string>;
}

export function getCurrentUser(): AuthUser | null {
  const user = netlifyIdentity.currentUser();
  if (!user) return null;
  return normalize(user);
}

export function normalize(user: any): AuthUser {
  return {
    id: user.id || user.email,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Builder',
    avatar: user.user_metadata?.avatar_url,
    jwt: (force?: boolean) => user.jwt(force),
  };
}

export async function fetchMemberMe(): Promise<any> {
  const token = await getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/api/members?action=me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveMemberMe(body: any): Promise<any> {
  const token = await getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/api/members?action=me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function voteCreator(creatorId: string, direction: 'up' | 'down' | null): Promise<{ profile: any; summary: any }> {
  const token = await getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/api/members?action=vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ creatorId, direction }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchVotes(): Promise<Record<string, any>> {
  const res = await fetch('/api/members?action=votes');
  if (!res.ok) return {};
  return res.json();
}

export async function submitCreator(handle: string, name: string, category: string, reason: string): Promise<any> {
  const token = await getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/api/members?action=submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ handle, name, category, reason }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchSubmissions(): Promise<any[]> {
  const token = await getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/api/members?action=submissions', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function moderateSubmission(id: string, status: 'approved' | 'rejected'): Promise<any> {
  const token = await getToken();
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/api/members?action=moderate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getToken(): Promise<string | null> {
  const user = netlifyIdentity.currentUser();
  if (!user) return null;
  return user.jwt(true);
}

export { netlifyIdentity };
