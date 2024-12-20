// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('Service Worker registrado com sucesso', registration);
  }).catch(function(error) {
    console.error('Falha ao registrar o Service Worker', error);
  });
}

// Relógio em tempo real
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

// Armazenar e recuperar alarmes
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];

function setAlarm() {
  const alarmTime = document.getElementById('alarmTime').value;
  const message = document.getElementById('message').value;
  if (alarmTime && message) {
    const alarm = { time: alarmTime, message: message };
    alarms.push(alarm);
    localStorage.setItem('alarms', JSON.stringify(alarms));
    addAlarmToList(alarm);
  }
}

function addAlarmToList(alarm) {
  const alarmsList = document.getElementById('alarmsList');
  const li = document.createElement('li');
  li.classList.add('alarm-item');
  const span = document.createElement('span');
  span.classList.add('message');
  span.textContent = `Alarme: ${alarm.time} - Mensagem: ${alarm.message}`;
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash', 'delete-button');
  deleteIcon.onclick = () => deleteAlarm(alarm, li);
  li.appendChild(span);
  li.appendChild(deleteIcon);
  alarmsList.appendChild(li);
}

function deleteAlarm(alarm, li) {
  alarms = alarms.filter(a => a !== alarm);
  localStorage.setItem('alarms', JSON.stringify(alarms));
  li.remove();
}

function checkAlarms() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  console.log(`Hora atual: ${currentTime}`); // Adiciona log para depuração
  alarms.forEach(alarm => {
    console.log(`Verificando alarme: ${alarm.time}`); // Adiciona log para depuração
    if (alarm.time === currentTime) {
      sendPushNotification(alarm.message); // Envia notificação push
      playAlarmSound();
      showAlarmPopup(alarm.message);
      alarms = alarms.filter(a => a !== alarm);
      localStorage.setItem('alarms', JSON.stringify(alarms));
    }
  });
}

function playAlarmSound() {
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.currentTime = 0; // Reinicia o áudio
  alarmSound.play().catch(error => console.error('Erro ao tocar o som do alarme:', error));
}

function sendPushNotification(message) {
  navigator.serviceWorker.ready.then(function(registration) {
    registration.showNotification('Alarme', {
      body: message,
      icon: 'icone.png',
      vibrate: [200, 100, 200],
      data: { url: window.location.href },
      tag: 'alarm-notification'
    });
  });
}

function showAlarmPopup(message) {
  const popup = document.getElementById('alarmPopup');
  const alarmMessage = document.getElementById('alarmMessage');
  alarmMessage.textContent = message;
  popup.style.display = 'flex';
}

function stopAlarm() {
  const popup = document.getElementById('alarmPopup');
  popup.style.display = 'none';
  stopAlarmSound(); // Adiciona função para parar o som
}

function stopAlarmSound() {
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.pause();
  alarmSound.currentTime = 0; // Reinicia o áudio
}

document.addEventListener('DOMContentLoaded', () => {
  alarms.forEach(addAlarmToList);
  Notification.requestPermission();
  updateClock(); // Chama updateClock para garantir que o relógio é atualizado imediatamente
  setInterval(checkAlarms, 1000); // Reduz o intervalo para checar alarmes a cada segundo
});
