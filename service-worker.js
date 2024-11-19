self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
  self.skipWaiting(); // Ativação imediata
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
      body: data.body,
      icon: 'icone.png',
      vibrate: [200, 100, 200],
      data: { url: data.url }
  };
  event.waitUntil(
      self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
      clients.openWindow(event.notification.data.url)
  );
});
