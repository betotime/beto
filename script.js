// Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker registrado com sucesso."))
      .catch((error) => console.error("Erro ao registrar o Service Worker:", error));
}

// Solicitar permissão para notificações
if ("Notification" in window) {
  Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
          alert("As notificações precisam ser ativadas para os alarmes.");
      }
  });
}

// Relógio em tempo real
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Função para criar notificações
function scheduleNotification(time, message) {
  const now = new Date();
  const alarmTime = new Date(`${now.toDateString()} ${time}`);

  if (alarmTime > now) {
      const timeout = alarmTime - now;
      setTimeout(() => {
          showNotification(message);
      }, timeout);
  } else {
      alert("A hora do alarme já passou!");
  }
}

function showNotification(message) {
  if ("Notification" in window && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("⏰ Alarme!", {
              body: message,
              icon: "/alarm-icon.png",
              vibrate: [200, 100, 200],
              tag: "alarm",
              requireInteraction: true,
          });
      });
  }
}

// Adicionar alarmes
function addAlarm() {
  const timeInput = document.getElementById("alarm-time").value;
  const messageInput = document.getElementById("alarm-message").value;

  if (!timeInput || !messageInput) {
      alert("Por favor, preencha todos os campos.");
      return;
  }

  const alarmContainer = document.createElement("div");
  alarmContainer.textContent = `${timeInput} - ${messageInput}`;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  deleteButton.onclick = () => {
      alarmContainer.remove();
  };

  alarmContainer.appendChild(deleteButton);
  document.getElementById("alarm-list").appendChild(alarmContainer);

  scheduleNotification(timeInput, messageInput);
}
