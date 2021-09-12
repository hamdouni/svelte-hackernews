const cacheName = 'static-cache';
const assets = [
    '/',
    'index.html',
    'bundle.css',
    'icono.min.css',
    'style.css',
    'bundle.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});