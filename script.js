// Registra o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}

// Solicita permissão para notificações
if (Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Permissão para notificações concedida!");
    } else {
      console.log("Permissão para notificações negada.");
    }
  });
}

// Função para mostrar o relógio em tempo real
function updateClock() {
  const timeElement = document.getElementById("time");
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

// Função para exibir e esconder o popup do alarme
function showAlarmPopup(message) {
  const popup = document.getElementById('alarm-message-popup');
  const messageText = document.getElementById('alarm-message-text');
  messageText.textContent = message;
  popup.style.display = 'flex';

  // Toca o som
  const audio = new Audio('sound.mp3');
  audio.play();

  // Ação do botão "Parar"
  document.getElementById('stop-alarm').onclick = () => {
    audio.pause();
    popup.style.display = 'none';
  };
}

// Função para agendar o alarme
let alarmTimeouts = [];
function scheduleAlarm() {
  const time = document.getElementById('alarm-time').value;
  const message = document.getElementById('alarm-message').value;
  if (!time || !message) return;

  const [hour, minute] = time.split(":").map(Number);
  const alarmTime = new Date();
  alarmTime.setHours(hour, minute, 0, 0);

  const timeDifference = alarmTime - new Date();
  if (timeDifference > 0) {
    const timeout = setTimeout(() => {
      showAlarmPopup(message);
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: 'triggerAlarm',
          message: message
        });
      }
    }, timeDifference);
    alarmTimeouts.push(timeout);
  }

  // Exibe o alarme na lista
  const alarmList = document.getElementById('alarm-list');
  const alarmItem = document.createElement('li');
  alarmItem.textContent = `${time} - ${message}`;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.onclick = () => {
    clearTimeout(timeout);
    alarmList.removeChild(alarmItem);
  };
  alarmItem.appendChild(deleteButton);
  alarmList.appendChild(alarmItem);
}

// Lida com a configuração do alarme
document.getElementById('set-alarm').onclick = scheduleAlarm;
