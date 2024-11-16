const CACHE_NAME = 'alarm-clock-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/sound.mp3',
  '/manifest.json'
];

// Instala o service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativa o service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Faz a interceptação de requisições para fornecer o conteúdo em cache quando necessário
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Função para mostrar notificações
function showNotification(message) {
  self.registration.showNotification('Alarme!', {
    body: message,
    icon: 'icon.png',
  });
}

// Alarme disparado
self.addEventListener('message', (event) => {
  if (event.data.action === 'triggerAlarm') {
    showNotification(event.data.message);
  }
});
