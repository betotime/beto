// Função para exibir o relógio em tempo real
function startClock() {
  const clock = document.getElementById("clock");
  setInterval(() => {
      const now = new Date();
      clock.innerHTML = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  }, 1000);
}

// Função para adicionar um alarme
document.getElementById("add-alarm").addEventListener("click", function() {
  const alarmTime = document.getElementById("alarm-time").value;
  const message = document.getElementById("message").value || "Alarme disparado!";
  if (alarmTime) {
      const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
      alarms.push({ time: alarmTime, message: message });
      localStorage.setItem("alarms", JSON.stringify(alarms));
      displayAlarms();
      checkAlarms();
  }
});

// Exibe os alarmes da lista
function displayAlarms() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  const alarmList = document.getElementById("alarm-list");
  alarmList.innerHTML = '';
  alarms.forEach((alarm, index) => {
      const li = document.createElement('li');
      li.textContent = `${alarm.time} - ${alarm.message}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Excluir";
      deleteButton.classList.add('delete');
      deleteButton.onclick = function() {
          alarms.splice(index, 1);
          localStorage.setItem("alarms", JSON.stringify(alarms));
          displayAlarms();
      };
      li.appendChild(deleteButton);
      alarmList.appendChild(li);
  });
}

// Verifica se algum alarme deve ser disparado
function checkAlarms() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  const now = new Date();
  alarms.forEach(alarm => {
      const [hours, minutes] = alarm.time.split(":");
      const alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0);

      if (now >= alarmTime && now < new Date(alarmTime.getTime() + 1000)) {
          triggerAlarm(alarm.message);
      }
  });
}

// Função para disparar o alarme
function triggerAlarm(message) {
  // Envia a notificação push
  if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification('Alarme Disparado!', {
              body: message,
              icon: 'icon.png',
              sound: 'alarm-sound.mp3',
              vibrate: [1000, 1000, 1000],
              tag: 'alarm-notification',
          });
      });
  }

  // Reproduz o som localmente
  const audio = new Audio('alarm-sound.mp3');
  audio.play();

  // Vibra o dispositivo
  if (navigator.vibrate) {
      navigator.vibrate([1000, 1000, 1000]);
  }

  // Mostra a mensagem em tela cheia
  const fullScreenMessage = document.createElement('div');
  fullScreenMessage.textContent = message;
  fullScreenMessage.style.position = 'fixed';
  fullScreenMessage.style.top = 0;
  fullScreenMessage.style.left = 0;
  fullScreenMessage.style.right = 0;
  fullScreenMessage.style.bottom = 0;
  fullScreenMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  fullScreenMessage.style.color = 'white';
  fullScreenMessage.style.display = 'flex';
  fullScreenMessage.style.justifyContent = 'center';
  fullScreenMessage.style.alignItems = 'center';
  fullScreenMessage.style.fontSize = '3em';
  fullScreenMessage.style.zIndex = '9999';
  fullScreenMessage.style.cursor = 'pointer';

  fullScreenMessage.onclick = function() {
      fullScreenMessage.remove();
  };

  document.body.appendChild(fullScreenMessage);
}

// Inicia o relógio
startClock();

// Exibe os alarmes ao carregar
displayAlarms();

// Verifica os alarmes a cada 60 segundos
setInterval(checkAlarms, 60000);
