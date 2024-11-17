self.addEventListener('push', function(event) {
  let options = {
      body: event.data.text(),
      icon: 'icon.png',
      sound: 'alarm-sound.mp3',
      vibrate: [1000, 1000, 1000],
      tag: 'alarm-notification',
  };

  event.waitUntil(
      self.registration.showNotification('Alarme Disparado!', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
      clients.openWindow('/')  // Abre a página da aplicação ao clicar
  );
});
