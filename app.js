// Função para atualizar o relógio em tempo real
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('currentTime').textContent = timeString;
}

// Chama a função para atualizar o relógio a cada segundo
setInterval(updateClock, 1000);

// Lista de alarmes configurados
let alarms = [];

// Função para disparar o alarme (som + mensagem)
function triggerAlarm(alarm) {
    // Tocar o som
    const audio = new Audio('sound.mp3');
    audio.play();

    // Cria a mensagem do alarme
    const alarmMessageElement = document.createElement('div');
    alarmMessageElement.id = 'alarmMessage';
    alarmMessageElement.textContent = alarm.message;

    // Cria o botão de parar
    const stopButton = document.createElement('button');
    stopButton.classList.add('stop-button');
    stopButton.textContent = "Parar";
    stopButton.onclick = () => {
        // Parar o som
        audio.pause();
        audio.currentTime = 0;

        // Remover a mensagem e o botão do alarme
        alarmMessageElement.remove();
        stopButton.remove();
    };

    // Adiciona a mensagem e o botão no corpo da página
    document.body.appendChild(alarmMessageElement);
    document.body.appendChild(stopButton);
}

// Função para configurar o alarme
function setAlarm() {
    const message = document.getElementById('alarmMessageInput').value;
    const time = document.getElementById('alarmTimeInput').value;

    if (!message || !time) {
        alert('Por favor, preencha a mensagem e o horário do alarme.');
        return;
    }

    const alarmTime = new Date();
    const [hours, minutes] = time.split(':');
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);

    const now = new Date();
    const timeDifference = alarmTime - now;

    if (timeDifference <= 0) {
        alert('O horário do alarme já passou. Escolha um horário no futuro.');
        return;
    }

    // Adiciona o alarme na lista de alarmes configurados
    const alarm = { message: message, time: alarmTime };
    alarms.push(alarm);

    // Exibe os alarmes configurados na tela
    displayScheduledAlarms();

    // Configura o alarme para disparar no horário agendado
    setTimeout(() => {
        triggerAlarm(alarm);
    }, timeDifference);
}

// Função para exibir os alarmes configurados
function displayScheduledAlarms() {
    const alarmList = document.getElementById('alarmList');
    alarmList.innerHTML = ''; // Limpa a lista de alarmes exibidos

    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        const alarmTimeFormatted = alarm.time.toLocaleTimeString();

        li.innerHTML = `
            <span class="alarm-time">${alarmTimeFormatted}</span>
            <span class="alarm-message">${alarm.message}</span>
            <button class="delete-button" onclick="deleteAlarm(${index})">Excluir</button>
        `;

        alarmList.appendChild(li);
    });
}

// Função para excluir um alarme
function deleteAlarm(index) {
    alarms.splice(index, 1); // Remove o alarme da lista
    displayScheduledAlarms(); // Atualiza a exibição dos alarmes configurados
}
