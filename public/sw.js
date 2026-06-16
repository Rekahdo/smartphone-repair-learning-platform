const CACHE_NAME = "repairmaster-cache-v3";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() =>
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    )
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle valid HTTP/HTTPS GET requests
  if (
    event.request.method !== "GET" ||
    (!event.request.url.startsWith("http:") && !event.request.url.startsWith("https:"))
  ) {
    return;
  }

  // Pure network-first pass through
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache only valid 200 HTTP responses
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network is completely offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // If it's a navigation request, try serving index.html
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
      })
  );
});
