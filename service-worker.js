self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
      body: data.message,
      icon: 'icone.png'
  });
});
