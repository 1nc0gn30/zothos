import { useEffect, useState, useCallback } from 'react';
import type { CreatorProfile } from '../types';

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const version = 1;

export interface CreatorMediaState {
  media: string[];
  posts: { text: string; url?: string; createdAt?: string }[];
  avatar: string;
  banner: string;
  lastUpdated: number;
  source: 'bundled' | 'cached' | 'fetched';
}

function cacheKey(id: string) {
  return `cp_media_v${version}_${id}`;
}

export function getCachedCreatorMedia(id: string): CreatorMediaState | null {
  try {
    const raw = localStorage.getItem(cacheKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CreatorMediaState;
    if (Date.now() - parsed.lastUpdated > TTL_MS) return null;
    return { ...parsed, source: 'cached' };
  } catch {
    return null;
  }
}

function setCachedCreatorMedia(id: string, state: CreatorMediaState) {
  try {
    localStorage.setItem(cacheKey(id), JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function bundledMediaFor(creator: CreatorProfile): CreatorMediaState {
  return {
    media: creator.media,
    posts: [],
    avatar: creator.avatar,
    banner: creator.banner,
    lastUpdated: Date.now(),
    source: 'bundled',
  };
}

async function fetchWithTimeout(url: string, timeout = 6000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    return res;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

function tryFetchAvatar(handle: string): Promise<string | null> {
  // unavatar provides a reliable public avatar resolver
  const url = `https://unavatar.io/twitter/${handle.replace('@', '')}?fallback=false`;
  return fetchWithTimeout(url, 4000)
    .then((res) => (res.ok && res.headers.get('content-type')?.startsWith('image') ? url : null))
    .catch(() => null);
}

/* no reliable public banner API without X auth */

export async function refreshCreatorMedia(creator: CreatorProfile): Promise<CreatorMediaState> {
  const cached = getCachedCreatorMedia(creator.id);
  if (cached) return cached;

  const bundled = bundledMediaFor(creator);

  // Maya is the only fully verified creator with real bundled assets.
  if (creator.id === 'maya') {
    setCachedCreatorMedia(creator.id, bundled);
    return bundled;
  }

  // For other creators, attempt avatar refresh only. Media/posts require real sourcing.
  try {
    const freshAvatar = await tryFetchAvatar(creator.handle);
    if (freshAvatar) {
      const state: CreatorMediaState = {
        ...bundled,
        avatar: freshAvatar,
        source: 'fetched',
        lastUpdated: Date.now(),
      };
      setCachedCreatorMedia(creator.id, state);
      return state;
    }
  } catch (e) {
    console.warn(`refresh failed for ${creator.handle}`, e);
  }

  setCachedCreatorMedia(creator.id, bundled);
  return bundled;
}

export function clearCreatorMediaCache(id?: string) {
  try {
    if (id) {
      localStorage.removeItem(cacheKey(id));
    } else {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`cp_media_v${version}_`))
        .forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    /* ignore */
  }
}

export function useCreatorMedia(creator: CreatorProfile) {
  const [state, setState] = useState<CreatorMediaState>(() => {
    const cached = getCachedCreatorMedia(creator.id);
    return cached ?? bundledMediaFor(creator);
  });
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const next = await refreshCreatorMedia(creator);
      setState(next);
    } finally {
      setRefreshing(false);
    }
  }, [creator]);

  useEffect(() => {
    let mounted = true;
    refreshCreatorMedia(creator).then((next) => {
      if (mounted) setState(next);
    });
    return () => { mounted = false; };
  }, [creator.id]);

  return { ...state, refresh, refreshing };
}
