self.addEventListener('push', function(event) {
  const options = {
      body: event.data.text(),
      icon: 'icon.png',
      badge: 'badge.png',
      vibration: [200, 100, 200],  // Vibração contínua
      actions: [
          {
              action: 'parar',
              title: 'Parar',
          }
      ]
  };

  event.waitUntil(
      self.registration.showNotification('Alarme Programado', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  if (event.action === 'parar') {
      event.notification.close();
      // Lógica para parar som ou vibração (pode ser aprimorada)
  }
});
