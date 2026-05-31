const CACHE_NAME = 'piyayy-cache-v7';
const urlsToCache = [
  './',
  './splash.html',
  './index.html',
  './admin.html',
  './style.css',
  './fond.jpg',
  './fond-splash.jpg',
  './icon-piyayy.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Mise en cache des fichiers');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // On laisse passer les requêtes vers Firebase (Firestore)
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebase')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Pour les autres requêtes (fichiers statiques)
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    }).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match('./splash.html');
      }
      return new Response('Hors ligne', { status: 503 });
    })
  );
});
