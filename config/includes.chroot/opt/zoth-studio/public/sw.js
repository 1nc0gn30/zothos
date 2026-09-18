/**
 * ⚡ ZOTH STUDIO LOCAL SERVICE WORKER (v12.0-SPEED)
 * -------------------------------------------------------------
 * High-performance Cache-First Strategy for local static assets.
 * Guarantees 0ms disk response times, instant offline boot, and zero network delay.
 */

const CACHE_NAME = 'zoth-studio-v12-speed';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/showcase.html',
  '/showcase/tsubuyaki-vortex.html',
  '/comic/index.html',
  '/assets/zoth-theme.css',
  '/assets/zoth-theme.js',
  '/assets/zoth-nav.css',
  '/assets/zoth-nav.js',
  '/assets/zoth-speed-engine.js',
  '/assets/brand/zoth-seal-hermetic-on-dark.svg',
  '/assets/brand/zoth-golden-z-192.png',
  '/favicon.png'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Non-blocking precache notice:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for local assets, Network-First for API/dynamic
self.addEventListener('fetch', (event) => {
  if (!event.request || !event.request.url) return;
  
  let url;
  try {
    url = new URL(event.request.url);
  } catch (err) {
    return;
  }

  // Skip non-HTTP schemes (chrome-extension:, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Skip non-GET requests and WebSocket/SSE/API endpoints
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/v1/')) {
    return;
  }

  // Local static asset strategy: Cache-First with Background Revalidation
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone()).catch(() => {});
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      }).catch(() => fetch(event.request))
    );
  }
});
