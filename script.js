// Registrar o Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker registrado com sucesso."))
      .catch((error) => console.error("Erro ao registrar o Service Worker:", error));
}

// Solicitar permissão para notificações
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
          alert("Por favor, ative as notificações para que os alarmes funcionem.");
      }
  });
}

// Atualizar relógio em tempo real
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Lista de alarmes
const alarms = [];

// Adicionar um alarme
function addAlarm() {
  const timeInput = document.getElementById("alarm-time").value;
  const messageInput = document.getElementById("alarm-message").value;

  if (!timeInput || !messageInput) {
      alert("Por favor, preencha todos os campos.");
      return;
  }

  const alarmTime = new Date();
  const [hours, minutes] = timeInput.split(":").map(Number);
  alarmTime.setHours(hours, minutes, 0, 0);

  if (alarmTime <= new Date()) {
      alert("O horário do alarme deve ser no futuro!");
      return;
  }

  const alarm = { time: alarmTime, message: messageInput };
  alarms.push(alarm);

  displayAlarm(alarm);
  scheduleAlarm(alarm);
}

// Mostrar alarme na lista
function displayAlarm(alarm) {
  const alarmContainer = document.createElement("div");
  alarmContainer.className = "alarm-item";
  alarmContainer.textContent = `${alarm.time.toLocaleTimeString()} - ${alarm.message}`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  deleteButton.onclick = () => {
      alarmContainer.remove();
      const index = alarms.indexOf(alarm);
      if (index !== -1) alarms.splice(index, 1);
  };

  alarmContainer.appendChild(deleteButton);
  document.getElementById("alarm-list").appendChild(alarmContainer);
}

// Agendar o alarme
function scheduleAlarm(alarm) {
  const now = new Date();
  const timeout = alarm.time - now;

  setTimeout(() => {
      triggerAlarm(alarm);
  }, timeout);
}

// Disparar o alarme
function triggerAlarm(alarm) {
  const audio = new Audio("sound.mp3");
  audio.loop = true;
  audio.play();

  if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("⏰ Alarme!", {
              body: alarm.message,
              icon: "alarm-icon.png",
              requireInteraction: true,
          });
      });
  }

  const fullScreenMessage = document.createElement("div");
  fullScreenMessage.className = "fullscreen-alarm";
  fullScreenMessage.innerHTML = `
      <div class="alarm-content">
          <h1>${alarm.message}</h1>
          <button id="stop-alarm">Parar</button>
      </div>
  `;
  document.body.appendChild(fullScreenMessage);

  document.getElementById("stop-alarm").onclick = () => {
      audio.pause();
      fullScreenMessage.remove();
  };
}
