// service-worker.js

// Nome e versão do cache
const CACHE_NAME = 'pwa-alarm-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  // Inclua aqui outros arquivos que você quer que estejam disponíveis offline
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Ativa o SW imediatamente
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições e serve do cache se estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Lógica de notificação para alarmes
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Alarme';
  const options = {
    body: data.message,
    icon: '/icon.png', // Substitua pelo caminho do ícone se tiver um
    vibrate: [200, 100, 200],
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
