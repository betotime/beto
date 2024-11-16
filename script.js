// Variáveis globais
const alarmSound = new Audio('sound.mp3');
let alarms = [];

// Carregar alarmes do localStorage
window.onload = function() {
    if (localStorage.getItem('alarms')) {
        alarms = JSON.parse(localStorage.getItem('alarms'));
        renderAlarms();
    }
    startClock();
}

// Atualiza o relógio em tempo real
function startClock() {
    setInterval(() => {
        const now = new Date();
        const time = now.toLocaleTimeString();
        document.getElementById('time').textContent = time;
    }, 1000);
}

// Função para adicionar um alarme
function addAlarm() {
    const alarmTime = document.getElementById('alarm-time').value;
    const alarmMessage = document.getElementById('alarm-message').value;

    if (alarmTime && alarmMessage) {
        const alarm = {
            time: alarmTime,
            message: alarmMessage,
            id: Date.now()
        };

        alarms.push(alarm);
        saveAlarms();
        renderAlarms();
    }
}

// Salva alarmes no localStorage
function saveAlarms() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// Renderiza a lista de alarmes na tela
function renderAlarms() {
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';

    alarms.forEach(alarm => {
        const alarmItem = document.createElement('li');
        alarmItem.innerHTML = `${alarm.time} - ${alarm.message} <button onclick="deleteAlarm(${alarm.id})">Excluir</button>`;
        alarmList.appendChild(alarmItem);

        checkAlarm(alarm);
    });
}

// Função para excluir um alarme
function deleteAlarm(alarmId) {
    alarms = alarms.filter(alarm => alarm.id !== alarmId);
    saveAlarms();
    renderAlarms();
}

// Verifica se algum alarme deve ser acionado
function checkAlarm(alarm) {
    const now = new Date();
    const [hours, minutes] = alarm.time.split(':').map(num => parseInt(num, 10));
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (now >= alarmTime && now < alarmTime.getTime() + 60000) { // O alarme toca dentro de 1 minuto após o horário
        triggerAlarm(alarm);
    }
}

// Função que dispara o alarme
function triggerAlarm(alarm) {
    // Toca o som do alarme
    alarmSound.play();

    // Cria uma notificação
    if (Notification.permission === "granted") {
        new Notification("Alarme", {
            body: alarm.message,
            icon: "icon.png"
        });
    }

    // Exibe a mensagem do alarme em tela cheia
    document.getElementById('alarm-message-popup').style.display = 'flex';
    document.getElementById('alarm-message-text').textContent = alarm.message;
}

// Botão para parar o alarme
document.getElementById('stop-alarm').onclick = function() {
    alarmSound.pause();
    document.getElementById('alarm-message-popup').style.display = 'none';
};

// Solicita permissão para notificações
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
