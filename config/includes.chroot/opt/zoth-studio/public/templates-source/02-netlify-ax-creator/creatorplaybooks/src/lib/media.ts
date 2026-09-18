import { useState, useEffect } from 'react';
import type { CreatorProfile } from '../types';

const CACHE_KEY = 'mayagrowth_media_cache_v2';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

const FALLBACK_MEDIA = [
  '/maya/media1.jpg',
  '/maya/media2.png',
  '/maya/media3.jpg',
  '/maya/media4.jpg',
  '/maya/media5.jpg',
  '/maya/media6.jpg',
];

export interface MediaRefreshResult {
  media: string[];
  refreshedAt: string;
  source: 'live' | 'cache' | 'fallback';
  error?: string;
}

export async function refreshMayaMedia(profile: CreatorProfile): Promise<MediaRefreshResult> {
  const fallback = profile.media || FALLBACK_MEDIA;

  if (profile.id !== 'maya') {
    return { media: fallback, refreshedAt: new Date().toISOString(), source: 'fallback' };
  }

  const now = Date.now();
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.expires && parsed.expires > now) {
        return { media: parsed.media || fallback, refreshedAt: parsed.refreshedAt, source: 'cache' };
      }
    } catch {}
  }

  try {
    const res = await fetch('/api/maya-media.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const media = Array.isArray(data.media) ? data.media : fallback;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ media, refreshedAt: new Date().toISOString(), expires: now + CACHE_TTL_MS }));
    return { media, refreshedAt: new Date().toISOString(), source: 'live' };
  } catch (err) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ media: fallback, refreshedAt: new Date().toISOString(), expires: now + CACHE_TTL_MS }));
    return { media: fallback, refreshedAt: new Date().toISOString(), source: 'fallback', error: (err as Error).message };
  }
}

export function useMayaMedia(profile: CreatorProfile) {
  const [media, setMedia] = useState<string[]>(profile.media || FALLBACK_MEDIA);
  const [status, setStatus] = useState<{ source: string; refreshedAt: string; loading: boolean; error?: string }>({ source: 'fallback', refreshedAt: '-', loading: true });

  const refresh = async () => {
    setStatus((s) => ({ ...s, loading: true }));
    const result = await refreshMayaMedia(profile);
    setMedia(result.media);
    setStatus({ source: result.source, refreshedAt: result.refreshedAt, loading: false, error: result.error });
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, CACHE_TTL_MS);
    return () => clearInterval(id);
  }, [profile.id]);

  return { media, status, refresh };
}
