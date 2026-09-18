// AZOTH Comic Service Worker (Offline Cache Engine v1.0)
const CACHE_NAME = "azoth-comic-v1";
const ASSETS_TO_CACHE = [
  "/comic/",
  "/comic/s01e01.html",
  "/comic/s01e02.html",
  "/comic/s01e03.html",
  "/comic/soundboard.html",
  "/comic/characters.html",
  "/comic/share.html",
  "/styles.css",
  "/assets/zoth-nav.css",
  "/assets/zoth-nav.js",
  "/assets/comic-cinematic.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
