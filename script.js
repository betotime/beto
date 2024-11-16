const clockElement = document.getElementById("clock");
const alarmTimeInput = document.getElementById("alarmTime");
const alarmMessageInput = document.getElementById("alarmMessage");
const setAlarmButton = document.getElementById("setAlarm");
const alarmsList = document.getElementById("alarmsList");
const alarmPopup = document.getElementById("alarmPopup");
const popupMessage = document.getElementById("popupMessage");
const stopAlarmButton = document.getElementById("stopAlarm");

let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
let alarmTimeouts = [];

// Atualiza o relógio em tempo real
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Define um novo alarme
function setAlarm() {
  const alarmTime = alarmTimeInput.value;
  const alarmMessage = alarmMessageInput.value.trim();
  if (alarmTime && alarmMessage) {
    const alarm = {
      time: alarmTime,
      message: alarmMessage,
      id: Date.now()
    };
    alarms.push(alarm);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    alarmTimeInput.value = '';
    alarmMessageInput.value = '';
    renderAlarms();
  }
}

// Renderiza os alarmes na lista
function renderAlarms() {
  alarmsList.innerHTML = '';
  alarms.forEach(alarm => {
    const li = document.createElement("li");
    li.textContent = `${alarm.time} - ${alarm.message}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.onclick = () => deleteAlarm(alarm.id);
    li.appendChild(deleteButton);
    alarmsList.appendChild(li);
    scheduleAlarm(alarm);
  });
}

// Exclui um alarme
function deleteAlarm(id) {
  alarms = alarms.filter(alarm => alarm.id !== id);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  renderAlarms();
}

// Agenda o alarme
function scheduleAlarm(alarm) {
  const [hour, minute] = alarm.time.split(":").map(Number);
  const alarmTime = new Date();
  alarmTime.setHours(hour, minute, 0, 0);

  const timeDifference = alarmTime - new Date();
  if (timeDifference > 0) {
    const timeout = setTimeout(() => triggerAlarm(alarm), timeDifference);
    alarmTimeouts.push(timeout);
  }
}

// Exibe a mensagem do alarme
function triggerAlarm(alarm) {
  const sound = new Audio('sound.mp3');
  sound.play();
  popupMessage.textContent = alarm.message;
  alarmPopup.style.display = "flex";
  stopAlarmButton.onclick = () => stopAlarm(sound);
}

// Para o alarme
function stopAlarm(sound) {
  sound.pause();
  alarmPopup.style.display = "none";
}

// Configura os eventos
setAlarmButton.addEventListener("click", setAlarm);

// Atualiza o relógio a cada segundo
setInterval(updateClock, 1000);

// Inicializa a aplicação
renderAlarms();
updateClock();
