const CACHE_NAME = 'sa-property-cache-v2'; // Bumped version

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force new service worker to activate immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/']))
  );
});

self.addEventListener('activate', (e) => {
  // Delete old cache versions automatically
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Network-first strategy: Always try to get fresh code from GitHub first
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => caches.match(e.request)) // Fallback to offline cache if no internet
  );
});