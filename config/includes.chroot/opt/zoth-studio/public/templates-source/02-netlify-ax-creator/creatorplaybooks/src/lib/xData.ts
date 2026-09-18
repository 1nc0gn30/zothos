import { useEffect, useState, useCallback } from 'react';
import { xFallbackData } from './xFallbackData';

export interface XProfile {
  id: string;
  handle: string;
  name: string;
  bio: string;
  avatar: string | null;
  banner: string | null;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  verifiedType: string | null;
  url: string;
  location: string | null;
  tweets?: XTweet[];
}

export interface XTweet {
  id: string;
  text: string;
  createdAt: string;
  metrics: {
    retweet_count?: number;
    reply_count?: number;
    like_count?: number;
    quote_count?: number;
    impression_count?: number;
  };
  media: { url: string; type: string; width?: number; height?: number }[];
  isRetweet: boolean;
  isReply: boolean;
}

const TTL_MS = 15 * 60 * 1000; // 15 min live cache
const FALLBACK_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days for fallback data
const version = 2;

function cacheKey(handle: string) { return `x_profile_v${version}_${handle}`; }

function getCached(handle: string): XProfile | null {
  try {
    const raw = localStorage.getItem(cacheKey(handle));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.__cachedAt || 0) > TTL_MS) return null;
    return parsed;
  } catch { return null; }
}

function setCached(handle: string, data: XProfile) {
  try {
    localStorage.setItem(cacheKey(handle), JSON.stringify({ ...data, __cachedAt: Date.now() }));
  } catch { /* ignore */ }
}

function getFallback(handle: string): XProfile | null {
  const fb = xFallbackData[handle];
  if (!fb) return null;
  // Check if fallback is still fresh (within 7 days)
  const updated = new Date(fb.lastUpdated).getTime();
  if (Date.now() - updated > FALLBACK_TTL_MS) return null;
  return {
    id: fb.id,
    handle: fb.handle,
    name: fb.name,
    bio: fb.bio,
    avatar: fb.avatar,
    banner: fb.banner,
    followers: fb.followers,
    following: fb.following,
    posts: fb.posts,
    verified: fb.verified,
    verifiedType: fb.verifiedType,
    url: fb.url,
    location: fb.location,
    tweets: (fb as any).tweets || [],
  };
}

export async function fetchXProfile(handle: string, includeTweets = true): Promise<XProfile | null> {
  // 1. Try live cache first
  const cached = getCached(handle);
  if (cached) return cached;

  // 2. Try API
  try {
    const res = await fetch(`/api/x?handle=${encodeURIComponent(handle)}&tweets=${includeTweets}`);
    if (!res.ok) {
      // If API fails (e.g., credits depleted), use fallback
      console.warn(`X API failed for @${handle}: ${res.status}. Using fallback data.`);
      const fallback = getFallback(handle);
      if (fallback) {
        setCached(handle, fallback); // Cache fallback temporarily
        return fallback;
      }
      return null;
    }
    const data = await res.json();
    if (!data.handle) {
      const fallback = getFallback(handle);
      if (fallback) {
        setCached(handle, fallback);
        return fallback;
      }
      return null;
    }
    setCached(handle, data);
    return data;
  } catch (err) {
    console.warn(`X API network error for @${handle}:`, err);
    // 3. API completely down — use fallback
    const fallback = getFallback(handle);
    if (fallback) {
      setCached(handle, fallback);
      return fallback;
    }
    return null;
  }
}

export function useXProfile(handle: string, includeTweets = true) {
  const [profile, setProfile] = useState<XProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromFallback, setFromFallback] = useState(false);

  const load = useCallback(async () => {
    if (!handle) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setFromFallback(false);

    const data = await fetchXProfile(handle, includeTweets);
    if (data) {
      setProfile(data);
      // Check if this came from fallback (no __cachedAt means it's fresh from API, cached will have it)
      const cachedRaw = localStorage.getItem(cacheKey(handle));
      if (cachedRaw) {
        try {
          const parsed = JSON.parse(cachedRaw);
          // If the cached data matches fallback exactly, it's from fallback
          if (xFallbackData[handle] && parsed.id === xFallbackData[handle].id) {
            setFromFallback(true);
          }
        } catch {}
      }
    } else {
      setError(`Could not load X data for @${handle}`);
    }
    setLoading(false);
  }, [handle, includeTweets]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    // Clear cache and reload
    try { localStorage.removeItem(cacheKey(handle)); } catch {}
    load();
  }, [handle, load]);

  return { profile, loading, error, fromFallback, refresh };
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export function clearXCache(handle?: string) {
  try {
    if (handle) {
      localStorage.removeItem(cacheKey(handle));
    } else {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`x_profile_v${version}_`))
        .forEach((k) => localStorage.removeItem(k));
    }
  } catch { /* ignore */ }
}
