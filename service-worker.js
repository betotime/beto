self.addEventListener("install", (event) => {
  event.waitUntil(
      caches.open("alarm-clock-v1").then((cache) => {
          return cache.addAll([
              "index.html",
              "styles.css",
              "script.js",
              "alarm.mp3",
              "icon-192x192.png", // Ícone de notificação
              "icon-512x512.png"
          ]);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
      self.clients.claim() // Garante que o service worker assume o controle imediatamente
  );
});

// Ouvir eventos de push para disparar notificações
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Alarme!";
  const options = {
      body: data.body,
      icon: "icon-192x192.png",
      badge: "icon-192x192.png",
      vibrate: [200, 100, 200], // Vibração contínua até interação
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Interagir com a notificação clicada
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Aqui você pode abrir a página da aplicação ou realizar outra ação
  event.waitUntil(
      clients.openWindow("/")
  );
});
