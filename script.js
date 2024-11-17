// Função para atualizar o relógio
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById('clock').textContent = timeString;
}

// Atualiza o relógio a cada segundo
setInterval(updateClock, 1000);
updateClock();  // Chama a função imediatamente para não esperar 1 segundo

// Função para configurar alarme
const alarms = [];
document.getElementById('set-alarm').addEventListener('click', () => {
  const time = document.getElementById('time').value;
  const message = document.getElementById('message').value;
  if (time && message) {
    const alarmTime = new Date();
    const [hour, minute] = time.split(':').map(num => parseInt(num));
    alarmTime.setHours(hour);
    alarmTime.setMinutes(minute);
    alarmTime.setSeconds(0);
    
    alarms.push({ time: alarmTime, message });
    renderAlarms();
    scheduleAlarm(alarmTime, message);
  }
});

// Função para renderizar a lista de alarmes
function renderAlarms() {
  const alarmsList = document.getElementById('alarms-list');
  alarmsList.innerHTML = ''; // Limpa lista antes de renderizar
  alarms.forEach((alarm, index) => {
    const alarmDiv = document.createElement('div');
    alarmDiv.classList.add('alarm-item');
    alarmDiv.innerHTML = `
      <span>${alarm.time.toLocaleTimeString()} - ${alarm.message}</span>
      <button onclick="removeAlarm(${index})">Excluir</button>
    `;
    alarmsList.appendChild(alarmDiv);
  });
}

// Função para excluir um alarme
function removeAlarm(index) {
  alarms.splice(index, 1);
  renderAlarms();
}

// Função para agendar o alarme
function scheduleAlarm(time, message) {
  const now = new Date();
  const timeToAlarm = time.getTime() - now.getTime();
  
  if (timeToAlarm > 0) {
    setTimeout(() => {
      // Mostrar a notificação e tocar o som
      showNotification(message);
    }, timeToAlarm);
  }
}

// Função para exibir a notificação do alarme
function showNotification(message) {
  if (Notification.permission === 'granted') {
    const options = {
      body: message,
      vibrate: [500, 500, 500], // Vibração contínua
    };
    const notification = new Notification('Alarme Disparado!', options);

    notification.onclick = () => {
      notification.close();
    };

    // Tocar o som do alarme
    const audio = new Audio('alarm.mp3');  // Altere o nome do arquivo para 'alarm.mp3'
    audio.play();
  }
}

// Solicita permissão para exibir notificações
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}
