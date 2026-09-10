const bedrock = require('bedrock-protocol');

// Mantiene el proceso activo en el runner de GitHub Actions
setInterval(() => {}, 1000 * 60 * 60);

function createBot() {
    console.log('[NPC] Conectando bot al servidor de Minecraft Bedrock (Craqueado listo)...');

    try {
        const client = bedrock.createClient({
            host: 'Mell0108.aternos.me', // Dirección de Aternos Bedrock
            port: 29494,                 // Puerto asignado por Aternos
            username: 'Raboot_356',      // Nombre del bot dentro del juego
            offline: true,               // Modo sin cuenta Xbox Live premium
            skipPing: true               // Conexión directa RakNet
        });

        client.on('spawn', () => {
            console.log('====================================================');
            console.log('[NPC] ¡ÉXITO TOTAL! El bot ha entrado al servidor Bedrock.');
            console.log('====================================================');

            // Rutina Anti-AFK cada 20 segundos
            setInterval(() => {
                if (client) {
                    console.log('[NPC] Anti-AFK activo: simulando presencia.');
                }
            }, 20000);
        });

        client.on('join', () => {
            console.log('[NPC] Entrando al mundo de Bedrock...');
        });

        client.on('disconnect', (packet) => {
            console.log(`[NPC] Desconectado: ${JSON.stringify(packet)}`);
            console.log('[NPC] Reintentando en 15 segundos...');
            setTimeout(createBot, 15000);
        });

        client.on('error', (err) => {
            console.log(`[NPC] Error en red Bedrock: ${err.message}`);
        });

        client.on('close', () => {
            console.log('[NPC] Conexión cerrada. Reintentando en 15 segundos...');
            setTimeout(createBot, 15000);
        });

    } catch (error) {
        console.log(`[NPC] Error en inicialización: ${error.message}`);
        setTimeout(createBot, 15000);
    }
}

createBot();
