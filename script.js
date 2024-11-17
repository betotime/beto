let alarmeData = [];

document.getElementById('adicionar-alarme').addEventListener('click', function() {
    const horaAlarme = document.getElementById('hora-alarme').value;
    const mensagemAlarme = document.getElementById('mensagem').value;
    if (horaAlarme && mensagemAlarme) {
        const alarme = {
            hora: horaAlarme,
            mensagem: mensagemAlarme,
            disparado: false
        };
        alarmeData.push(alarme);
        atualizarListaAlarmes();
    }
});

function atualizarListaAlarmes() {
    const listaAlarmes = document.getElementById('lista-alarmes');
    listaAlarmes.innerHTML = '';
    alarmeData.forEach((alarme, index) => {
        const li = document.createElement('li');
        li.textContent = `Alarme às ${alarme.hora} - ${alarme.mensagem}`;
        listaAlarmes.appendChild(li);
    });
}

// Função que atualiza o relógio em tempo real
function atualizarRelogio() {
    const relogioElement = document.getElementById('relogio');
    const now = new Date();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    const segundos = String(now.getSeconds()).padStart(2, '0');
    relogioElement.textContent = `${horas}:${minutos}:${segundos}`;
}

// Verificar se algum alarme deve disparar
function verificarAlarmes() {
    const now = new Date();
    alarmeData.forEach((alarme, index) => {
        const horaAlarme = alarme.hora.split(':');
        if (!alarme.disparado && horaAlarme[0] == String(now.getHours()).padStart(2, '0') && horaAlarme[1] == String(now.getMinutes()).padStart(2, '0')) {
            alarme.disparado = true;
            enviarNotificacao(alarme.mensagem);
        }
    });
}

function enviarNotificacao(mensagem) {
    if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification('Alarme Disparado!', {
                body: mensagem,
                icon: 'icon.png',
                badge: 'badge.png',
                vibration: [200, 100, 200], // Vibração contínua
                actions: [
                    {
                        action: 'parar',
                        title: 'Parar',
                    }
                ]
            });
        });
    }
}

// Iniciar o relógio e verificar alarmes a cada segundo
setInterval(() => {
    atualizarRelogio();
    verificarAlarmes();
}, 1000);

// Solicitar permissão para notificações
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

