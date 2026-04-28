// ============================================
// PIYAYY - Service Worker
// Version : 1.0.0
// ============================================

const CACHE_NAME = 'piyayy-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/style.css',
  '/script.js',
  '/fond.jpg',
  '/icon-piyayy.png',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('[SW] Erreur cache:', err))
  );
  self.skipWaiting();
});

// Activation : nettoyer les anciens caches
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

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si le fichier est dans le cache, on le renvoie
        if (response) {
          return response;
        }
        // Sinon, on va le chercher sur le réseau
        return fetch(event.request).then(response => {
          // On met en cache la nouvelle version
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
      .catch(() => {
        // Si hors ligne et fichier non trouvé
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});