const version = '0.1.3';
const cacheName = 'static-cache-'+version;
const assets = [
    '/',
    'index.html',
    'style.css',
    'app.js',
];

self.addEventListener('install', event => {
  self.skipWaiting();
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

// clearing cache
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});
