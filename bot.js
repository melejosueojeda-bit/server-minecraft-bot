const bedrock = require('bedrock-protocol');

// Mantiene activo el script en el servidor de GitHub Actions
setInterval(() => {}, 1000 * 60 * 60);

function createBot() {
    console.log('[NPC] Conectando bot al servidor de Minecraft Bedrock...');

    try {
        const client = bedrock.createClient({
            host: 'Mell0108.aternos.me', // Host de Aternos Bedrock
            port: 29494,                 // Puerto dinámico de Aternos
            username: 'Raboot_356',      // Nombre del NPC dentro del juego
            offline: true,               // Servidor Craqueado / No-Premium
            skipPing: true               // Salto de ping para conexión directa
        });

        let keepAliveTimer;

        client.on('spawn', () => {
            console.log('====================================================');
            console.log('[NPC] ¡ÉXITO! Raboot_356 ha aparecido en el servidor.');
            console.log('====================================================');

            // Enviar movimiento anti-inactividad cada 15 segundos para evitar el crash/kick por AFK de Aternos
            keepAliveTimer = setInterval(() => {
                if (client && client.status === 'active') {
                    try {
                        // Enviar simulación de mirada y tick de juego
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
                        console.log('[NPC] Anti-AFK: Movimiento simulado en el servidor.');
                    } catch (e) {
                        // Si el paquete no coincide exactamente con la subversión, simplemente enviamos interact
                        try {
                            client.write('text', {
                                type: 'chat',
                                needs_translation: false,
                                source_name: 'Raboot_356',
                                message: '.afk',
                                xuid: '',
                                platform_chat_id: ''
                            });
                        } catch (_) {}
                    }
                }
            }, 15000);
        });

        client.on('join', () => {
            console.log('[NPC] Entrando al mundo de Bedrock...');
        });

        client.on('disconnect', (packet) => {
            if (keepAliveTimer) clearInterval(keepAliveTimer);
            console.log(`[NPC] Desconectado por el servidor: ${JSON.stringify(packet)}`);
            console.log('[NPC] Reintentando conexión en 20 segundos...');
            setTimeout(createBot, 20000);
        });

        client.on('error', (err) => {
            console.log(`[NPC] Error detectado: ${err.message}`);
        });

        client.on('close', () => {
            if (keepAliveTimer) clearInterval(keepAliveTimer);
            console.log('[NPC] Conexión cerrada. Reintentando en 20 segundos...');
            setTimeout(createBot, 20000);
        });

    } catch (error) {
        console.log(`[NPC] Error en inicialización: ${error.message}`);
        setTimeout(createBot, 20000);
    }
}

createBot();
