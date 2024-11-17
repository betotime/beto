// Função para exibir o relógio
function updateClock() {
  const clockElement = document.getElementById('clock');
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Função para adicionar o alarme
function addAlarm() {
  const message = document.getElementById('message').value;
  const alarmTime = document.getElementById('alarm-time').value;

  if (!message || !alarmTime) {
      alert("Por favor, preencha todos os campos.");
      return;
  }

  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  const alarm = {
      message: message,
      alarmTime: alarmTime,
      triggered: false
  };

  alarms.push(alarm);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  renderAlarms(); // Atualiza a lista de alarmes
}

// Função para renderizar os alarmes
function renderAlarms() {
  const alarmsList = document.getElementById('alarms-list');
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];

  alarmsList.innerHTML = ""; // Limpar lista antes de renderizar

  alarms.forEach((alarm, index) => {
      const alarmItem = document.createElement('div');
      alarmItem.classList.add('alarm-item');
      alarmItem.innerHTML = `
          <span>${alarm.message} - ${new Date(alarm.alarmTime).toLocaleString()}</span>
          <button onclick="deleteAlarm(${index})">Excluir</button>
      `;
      alarmsList.appendChild(alarmItem);
  });
}

// Função para excluir o alarme
function deleteAlarm(index) {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  renderAlarms(); // Atualiza a lista de alarmes
}

// Função para verificar os alarmes e disparar o alarme quando for a hora
function checkAlarms() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  const currentTime = new Date();

  alarms.forEach((alarm, index) => {
      const alarmTime = new Date(alarm.alarmTime);
      if (alarmTime <= currentTime && !alarm.triggered) {
          // Marcar o alarme como disparado
          alarm.triggered = true;
          localStorage.setItem("alarms", JSON.stringify(alarms));

          // Mostrar a notificação com a mensagem do alarme
          showNotification(alarm.message);

          // Tocar o som imediatamente
          const audio = new Audio('alarm.mp3');
          audio.loop = true;  // Loop para o som tocar até ser parado
          audio.play();

          // Vibrar o dispositivo (se suportado)
          if (navigator.vibrate) {
              navigator.vibrate([1000, 1000, 1000]); // Vibra 3 vezes
          }

          // Criar botão para parar o alarme
          showStopButton(audio, alarm, alarms, index);
      }
  });
}

// Função para mostrar a notificação do alarme (push)
function showNotification(message) {
  if (Notification.permission === 'granted') {
      const options = {
          body: message,
          icon: 'icon.png',  // Coloque o ícone desejado
      };
      new Notification('Alarme Disparado!', options);
  }
}

// Função para mostrar o botão "parar"
function showStopButton(audio, alarm, alarms, index) {
  const stopButton = document.createElement('button');
  stopButton.textContent = 'Parar';
  stopButton.style.position = 'fixed';
  stopButton.style.top = '50%';
  stopButton.style.left = '50%';
  stopButton.style.transform = 'translate(-50%, -50%)';
  stopButton.style.fontSize = '2em';
  stopButton.style.padding = '20px';
  stopButton.style.backgroundColor = '#f44336';
  stopButton.style.color = '#fff';
  stopButton.style.border = 'none';
  stopButton.style.borderRadius = '5px';
  stopButton.style.cursor = 'pointer';
  document.body.appendChild(stopButton);

  // Quando o botão "parar" for clicado, parar o som e remover o botão
  stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      stopButton.remove();

      // Remover vibração
      if (navigator.vibrate) {
          navigator.vibrate(0);  // Parar a vibração
      }

      // Remover o alarme disparado da lista
      alarms.splice(index, 1);
      localStorage.setItem('alarms', JSON.stringify(alarms));
  });
}

// Inicialização: Verificar os alarmes a cada segundo
setInterval(checkAlarms, 1000);

// Inicialização: Atualizar o relógio a cada segundo
setInterval(updateClock, 1000);

// Inicializa o relógio assim que a página carregar
window.onload = () => {
  updateClock();
  renderAlarms(); // Renderiza os alarmes salvos
};

// Evento do botão de adicionar alarme
document.getElementById('set-alarm').addEventListener('click', addAlarm);
