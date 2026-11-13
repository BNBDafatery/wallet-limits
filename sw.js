const CACHE = 'bnb-wallet-limits-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './fonts/plex-arabic-400.woff2',
  './fonts/plex-arabic-500.woff2',
  './fonts/plex-arabic-600.woff2',
  './fonts/plex-arabic-700.woff2',
  './fonts/plex-latin-400.woff2',
  './fonts/plex-latin-500.woff2',
  './fonts/plex-latin-600.woff2',
  './fonts/plex-latin-700.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
    return response;
  }).catch(() => caches.match(request).then((hit) => hit || caches.match('./index.html'))));
});
