// Função para atualizar o relógio em tempo real
function updateClock() {
  const timeElement = document.getElementById("time");
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Função para carregar os alarmes do localStorage
function loadAlarms() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  const alarmList = document.getElementById("alarmList");
  alarmList.innerHTML = ''; // Limpa a lista antes de recarregar

  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    li.textContent = `Alarme: ${alarm.time} - Mensagem: ${alarm.message}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.onclick = () => deleteAlarm(index);
    li.appendChild(deleteButton);
    alarmList.appendChild(li);
  });
}

// Função para adicionar um alarme
function addAlarm() {
  const messageInput = document.getElementById("alarmMessage");
  const timeInput = document.getElementById("alarmTime");

  const message = messageInput.value;
  const time = timeInput.value;

  if (message && time) {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    alarms.push({ message, time });
    localStorage.setItem("alarms", JSON.stringify(alarms));
    messageInput.value = '';
    timeInput.value = '';
    loadAlarms();
  }
}

// Função para excluir um alarme
function deleteAlarm(index) {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  loadAlarms();
}

// Função para verificar se o alarme deve disparar
function checkAlarms() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  alarms.forEach((alarm, index) => {
    if (alarm.time === currentTime) {
      triggerAlarm(alarm.message);
      deleteAlarm(index);  // Excluir alarme após disparar
    }
  });
}

// Função para disparar o alarme
function triggerAlarm(message) {
  // Exibir notificação
  new Notification("Alarme Disparado", {
    body: message,
    icon: 'alarm.png'
  });

  // Tocar som de alarme
  const audio = new Audio('alarm.mp3');
  audio.play();

  // Vibrar
  if (navigator.vibrate) {
    navigator.vibrate([500, 500, 500]);  // Vibração contínua (a cada 500ms)
  }

  // Ação quando o usuário clicar no botão "Parar"
  const stopButton = document.createElement("button");
  stopButton.textContent = "Parar Alarme";
  stopButton.onclick = () => {
    audio.pause();
    if (navigator.vibrate) {
      navigator.vibrate(0);  // Parar vibração
    }
    stopButton.remove();
  };
  document.body.appendChild(stopButton);
}

// Adicionar evento para o botão de adicionar alarme
document.getElementById("addAlarmButton").addEventListener("click", addAlarm);

// Atualizar o relógio a cada segundo
setInterval(updateClock, 1000);

// Carregar alarmes ao iniciar
window.onload = loadAlarms;

// Verificar alarmes a cada minuto
setInterval(checkAlarms, 60000);
