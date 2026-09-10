const bedrock = require('bedrock-protocol');

// Mantiene el proceso vivo en GitHub Actions
setInterval(() => {}, 1000 * 60 * 60);

// Lista de servidores a los que se conectará el bot
const servers = [
    {
        name: 'Servidor 1',
        host: 'Mell0108.aternos.me',
        port: 29494,
        username: 'Raboot_356'
    },
    {
        name: 'Servidor 2',
        host: 'Mell0108-WXFh.aternos.me',
        port: 14448,
        username: 'Raboot_356'
    }
];

function startBot(serverConfig) {
    console.log(`[${serverConfig.name}] Conectando a ${serverConfig.host}:${serverConfig.port}...`);

    try {
        const client = bedrock.createClient({
            host: serverConfig.host,
            port: serverConfig.port,
            username: serverConfig.username,
            offline: true,
            skipPing: true
        });

        let afkTimer;

        client.on('spawn', () => {
            console.log(`====================================================`);
            console.log(`[${serverConfig.name}] ¡ÉXITO! ${serverConfig.username} ha entrado al servidor.`);
            console.log(`====================================================`);

            // Rutina Anti-AFK cada 20 segundos para evitar inactividad
            afkTimer = setInterval(() => {
                if (client && client.status === 'active') {
                    try {
                        client.write('player_auth_input', {
                            pitch: 0,
                            yaw: Math.floor(Math.random() * 360),
                            position: { x: 0, y: 64, z: 0 },
                            move_vector: { x: 0, z: 0 },
                            head_yaw: 0,
                            input_data: 0,
                            input_mode: 'touch',
                            play_mode: 'normal',
                            interaction_model: 'touch',
                            gaze_direction: { x: 0, y: 0, z: 0 },
                            tick: 0n,
                            delta: { x: 0, y: 0, z: 0 },
                            transaction: null,
                            item_stack_request: null,
                            block_action: []
                        });
                        console.log(`[${serverConfig.name}] Anti-AFK activo.`);
                    } catch (_) {}
                }
            }, 20000);
        });

        // Respuestas a comandos del chat
        client.on('text', (packet) => {
            const msg = packet.message || '';
            const sender = packet.source_name || 'Jugador';

            if (msg.includes('!hola')) {
                sendChat(client, `¡Hola ${sender}! Estoy activo cuidando el servidor.`);
            } else if (msg.includes('!info')) {
                sendChat(client, `[NPC Bot] Conectado a ${serverConfig.host}:${serverConfig.port}`);
            }
        });

        client.on('disconnect', (packet) => {
            if (afkTimer) clearInterval(afkTimer);
            console.log(`[${serverConfig.name}] Desconectado: ${JSON.stringify(packet)}`);
            console.log(`[${serverConfig.name}] Reintentando en 20 segundos...`);
            setTimeout(() => startBot(serverConfig), 20000);
        });

        client.on('error', (err) => {
            console.log(`[${serverConfig.name}] Error: ${err.message}`);
        });

        client.on('close', () => {
            if (afkTimer) clearInterval(afkTimer);
            console.log(`[${serverConfig.name}] Conexión cerrada. Reintentando en 20 segundos...`);
            setTimeout(() => startBot(serverConfig), 20000);
        });

    } catch (error) {
        console.log(`[${serverConfig.name}] Error en inicialización: ${error.message}`);
        setTimeout(() => startBot(serverConfig), 20000);
    }
}

function sendChat(client, message) {
    try {
        client.write('text', {
            type: 'chat',
            needs_translation: false,
            source_name: 'Raboot_356',
            message: message,
            xuid: '',
            platform_chat_id: ''
        });
    } catch (_) {}
}

// Iniciar bots para todos los servidores configurados en paralelo
servers.forEach(server => startBot(server));
