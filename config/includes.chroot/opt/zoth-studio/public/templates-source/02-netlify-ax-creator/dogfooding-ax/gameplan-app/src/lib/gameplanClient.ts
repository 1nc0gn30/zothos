/** Self-healing gameplan progress sync.
 *
 * Priority:
 *   1. Server (Netlify Function) — primary store
 *   2. localStorage — fallback when server is unreachable
 *
 * On corrupt data, localStorage is wiped and the server recovers on next load.
 */

const SYNC_URL = '/api/gameplan-sync?userId=default';
const LOCAL_KEY = 'dogfooding-gameplan-progress';

export interface StoredProgress {
  completed: string[];
  updatedAt: string;
  clientVersion: string;
}

export async function loadProgress(): Promise<StoredProgress> {
  // Server first
  try {
    const res = await fetch(SYNC_URL, { headers: { accept: 'application/json' } });
    if (res.ok) {
      const data = (await res.json()) as StoredProgress;
      if (Array.isArray(data.completed)) {
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch { /* ignore */ }
        return data;
      }
    }
  } catch { /* server unreachable */ }

  // Heal localStorage if corrupt, then fall back
  healStorage();
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredProgress;
      if (Array.isArray(parsed.completed)) return parsed;
    }
  } catch { /* still corrupt */ }

  return { completed: [], updatedAt: '', clientVersion: '0' };
}

export async function saveProgress(completed: string[], clientVersion = '0'): Promise<boolean> {
  const entry: StoredProgress = {
    completed: completed.slice(0, 128),
    updatedAt: new Date().toISOString(),
    clientVersion: clientVersion.slice(0, 16),
  };

  // Write to server first
  try {
    const res = await fetch(SYNC_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(entry)); } catch { /* ignore */ }
      return true;
    }
  } catch { /* server unreachable */ }

  // Fallback: localStorage only
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(entry)); } catch { /* ignore */ }
  return false;
}

export async function resetProgress(): Promise<boolean> {
  let serverReset = false;
  try {
    const res = await fetch(SYNC_URL, { method: 'DELETE', headers: { accept: 'application/json' } });
    serverReset = res.ok;
  } catch { /* ignore */ }
  try { localStorage.removeItem(LOCAL_KEY); } catch { /* ignore */ }
  return serverReset;
}

export function healStorage(): void {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.completed)) {
      localStorage.removeItem(LOCAL_KEY);
    }
  } catch {
    localStorage.removeItem(LOCAL_KEY);
  }
}
