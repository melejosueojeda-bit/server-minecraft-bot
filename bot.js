const bedrock = require('bedrock-protocol');

// Mantiene activo el runner de GitHub Actions
setInterval(() => {}, 1000 * 60 * 60);

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
    let client = null;
    let afkTimer = null;
    let isConnecting = false;

    function connect() {
        if (isConnecting) return;
        isConnecting = true;

        console.log(`[${serverConfig.name}] Intentando conectar a ${serverConfig.host}:${serverConfig.port}...`);

        try {
            client = bedrock.createClient({
                host: serverConfig.host,
                port: serverConfig.port,
                username: serverConfig.username,
                offline: true,
                skipPing: true
            });

            client.on('spawn', () => {
                isConnecting = false;
                console.log(`====================================================`);
                console.log(`[${serverConfig.name}] ¡CONECTADO Y ACTIVO! (${serverConfig.username})`);
                console.log(`====================================================`);

                if (afkTimer) clearInterval(afkTimer);
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
                        } catch (_) {}
                    }
                }, 20000);
            });

            client.on('text', (packet) => {
                const msg = packet.message || '';
                const sender = packet.source_name || 'Jugador';

                if (msg.includes('!hola')) {
                    sendChat(client, `¡Hola ${sender}! Estoy cuidando el servidor.`);
                } else if (msg.includes('!info')) {
                    sendChat(client, `[NPC] Bot activo en ${serverConfig.host}:${serverConfig.port}`);
                }
            });

            client.on('disconnect', (packet) => {
                cleanup();
                console.log(`[${serverConfig.name}] Desconectado. Reintentando en 25s...`);
                setTimeout(connect, 25000);
            });

            client.on('error', (err) => {
                console.log(`[${serverConfig.name}] Error: ${err.message}`);
                cleanup();
                setTimeout(connect, 25000);
            });

            client.on('close', () => {
                cleanup();
                console.log(`[${serverConfig.name}] Conexión cerrada. Reintentando en 25s...`);
                setTimeout(connect, 25000);
            });

        } catch (error) {
            console.log(`[${serverConfig.name}] Error de inicio: ${error.message}`);
            cleanup();
            setTimeout(connect, 25000);
        }
    }

    function cleanup() {
        isConnecting = false;
        if (afkTimer) clearInterval(afkTimer);
        if (client) {
            try { client.close(); } catch (_) {}
            client = null;
        }
    }

    connect();
}

function sendChat(client, message) {
    if (!client) return;
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

// Iniciar cada servidor una sola vez
servers.forEach(server => startBot(server));
