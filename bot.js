const bedrock = require('bedrock-protocol');

function createBot() {
    console.log('[NPC] Intentando conectar al servidor Bedrock...');

    const client = bedrock.createClient({
        host: 'Mell0108.aternos.me', // Hostname del servidor Aternos Bedrock
        port: 29494,                 // Puerto del servidor Aternos (asignado dinámicamente)
        username: 'Raboot_356',      // Nombre del bot dentro del juego
        offline: true,               // Servidor sin autenticación premium (cracked/offline)
        version: '1.26.45.1'         // Versión exacta de Bedrock del servidor
    });

    client.on('spawn', () => {
        console.log('[NPC] ¡Bot conectado y visible en el servidor!');

        // Rutina Anti-AFK: acción cada 45 segundos para evitar ser expulsado por inactividad
        const afkInterval = setInterval(() => {
            if (!client || client.status === 'disconnected') {
                clearInterval(afkInterval);
                return;
            }

            try {
                // Enviar paquete de movimiento para simular actividad del jugador
                client.write('interact', {
                    action_id: 0,
                    to_entity_id: 0,
                    head_position: { x: 0, y: 0, z: 0 }
                });
                console.log('[NPC] Acción anti-inactividad ejecutada correctamente.');
            } catch (err) {
                console.log(`[NPC] Error en ciclo anti-AFK: ${err.message}`);
                clearInterval(afkInterval);
            }
        }, 45000);
    });

    client.on('login', () => {
        console.log('[NPC] Conexión establecida con el servidor Bedrock.');
    });

    // Reconexión automática al ser desconectado
    client.on('disconnect', (packet) => {
        const reason = packet?.message || 'desconocido';
        console.log(`[NPC] Desconectado del servidor: ${reason}. Reintentando en 25 segundos...`);
        try { client.close(); } catch (_) {}
        setTimeout(createBot, 25000);
    });

    // Reconexión automática si la conexión se cierra por cualquier motivo
    client.on('close', () => {
        console.log('[NPC] Conexión cerrada inesperadamente. Reintentando en 25 segundos...');
        setTimeout(createBot, 25000);
    });

    client.on('error', (err) => {
        console.log(`[NPC] Error crítico de red: ${err.message}`);
    });
}

createBot();
