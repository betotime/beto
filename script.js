// Função para atualizar o relógio em tempo real
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.innerHTML = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// Função para programar um alarme
function setAlarm() {
  const alarmTime = document.getElementById("alarm-time").value;
  const message = document.getElementById("message").value;

  if (!alarmTime || !message) {
      alert("Por favor, preencha todos os campos.");
      return;
  }

  // Adiciona o alarme na lista de alarmes
  const alarmList = document.getElementById("alarm-list");
  const alarmId = Date.now();
  const alarmElement = document.createElement("div");
  alarmElement.id = `alarm-${alarmId}`;
  alarmElement.innerHTML = `
      <span>Alarme programado para: ${alarmTime}</span>
      <button onclick="removeAlarm(${alarmId})">Excluir</button>
  `;
  alarmList.appendChild(alarmElement);

  // Salva o alarme no localStorage
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  alarms.push({ id: alarmId, time: alarmTime, message });
  localStorage.setItem("alarms", JSON.stringify(alarms));

  // Define o alarme para disparar
  setAlarmTimer(alarmId, alarmTime, message);
}

// Função para configurar o alarme no horário programado
function setAlarmTimer(id, alarmTime, message) {
  const [hours, minutes] = alarmTime.split(":").map(Number);
  const now = new Date();
  const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

  if (alarmDate < now) {
      alarmDate.setDate(alarmDate.getDate() + 1); // Se o horário já passou, define para o próximo dia
  }

  const timeToAlarm = alarmDate.getTime() - now.getTime();
  setTimeout(() => triggerAlarm(message, id), timeToAlarm);
}

// Função para exibir a mensagem do alarme e tocar o som
function triggerAlarm(message, id) {
  const alarmPopup = document.getElementById("alarm-popup");
  const alarmMessage = document.getElementById("alarm-message");
  const alarmSound = document.getElementById("alarm-sound");

  alarmMessage.innerHTML = message;
  alarmPopup.style.display = "flex"; // Torna o pop-up visível
  alarmSound.play();

  // A função stopAlarm já está definida fora para parar o som e esconder o pop-up
}

// Função para parar o alarme
function stopAlarm() {
  const alarmPopup = document.getElementById("alarm-popup");
  const alarmSound = document.getElementById("alarm-sound");

  alarmPopup.style.display = "none"; // Esconde o pop-up
  alarmSound.pause();
  alarmSound.currentTime = 0; // Reseta o som para o início

  // Remove o alarme da lista de localStorage
  const alarms = JSON.parse(localStorage.getItem("alarms"));
  const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
  localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
  removeAlarm(id); // Remove o alarme da lista visual
}

// Função para excluir um alarme da lista
function removeAlarm(id) {
  const alarmElement = document.getElementById(`alarm-${id}`);
  alarmElement.remove();

  const alarms = JSON.parse(localStorage.getItem("alarms"));
  const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
  localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
}

// Carregar alarmes programados ao carregar a página
window.onload = function() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  alarms.forEach(alarm => {
      setAlarmTimer(alarm.id, alarm.time, alarm.message);
      const alarmList = document.getElementById("alarm-list");
      const alarmElement = document.createElement("div");
      alarmElement.id = `alarm-${alarm.id}`;
      alarmElement.innerHTML = `
          <span>Alarme programado para: ${alarm.time}</span>
          <button onclick="removeAlarm(${alarm.id})">Excluir</button>
      `;
      alarmList.appendChild(alarmElement);
  });
}
