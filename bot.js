const bedrock = require('bedrock-protocol');

// Previene que Node.js se cierre en GitHub Actions
setInterval(() => {}, 1000 * 60 * 60);

function createBot() {
    console.log('[NPC] Conectando bot al servidor de Minecraft Bedrock en Aternos...');

    try {
        const client = bedrock.createClient({
            host: 'Mell0108.aternos.me', // Dirección de Aternos
            port: 29494,                 // Puerto dinámico asignado por Aternos
            username: 'Raboot_356',      // Nombre del bot dentro del juego
            offline: true,               // Servidor sin autenticación Xbox Live (no-premium)
            skipPing: true               // Evita el timeout conectando directamente via RakNet
        });

        client.on('spawn', () => {
            console.log('----------------------------------------------------');
            console.log('[NPC] ¡ÉXITO! El bot ha entrado correctamente al servidor.');
            console.log('----------------------------------------------------');

            // Rutina Anti-AFK cada 30 segundos
            setInterval(() => {
                if (client) {
                    console.log('[NPC] Anti-AFK: Bot activo en el servidor.');
                }
            }, 30000);
        });

        client.on('join', () => {
            console.log('[NPC] Uniéndose al mundo Bedrock...');
        });

        client.on('disconnect', (packet) => {
            console.log(`[NPC] Desconectado del servidor. Razón: ${JSON.stringify(packet)}`);
            console.log('[NPC] Reintentando conexión en 20 segundos...');
            setTimeout(createBot, 20000);
        });

        client.on('error', (err) => {
            console.log(`[NPC] Error de conexión: ${err.message}`);
        });

        client.on('close', () => {
            console.log('[NPC] Conexión cerrada. Reintentando en 20 segundos...');
            setTimeout(createBot, 20000);
        });

    } catch (error) {
        console.log(`[NPC] Error crítico al inicializar bot: ${error.message}`);
        setTimeout(createBot, 20000);
    }
}

createBot();
