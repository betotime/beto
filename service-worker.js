self.addEventListener("install", (event) => {
  event.waitUntil(
      caches.open("alarm-cache").then((cache) => {
          return cache.addAll(["./", "./style.css", "./script.js", "./sound.mp3"]);
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request);
      })
  );
});
