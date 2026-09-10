const bedrock = require('bedrock-protocol');

// Mantener el proceso vivo siempre (previene salida prematura de Node.js)
const keepAlive = setInterval(() => {}, 1000 * 60 * 60);

async function createBot() {
    console.log('[NPC] Iniciando bot para servidor Bedrock...');

    // 1. Ping al servidor para detectar versión automáticamente
    let serverVersion = '1.21.44.01';
    try {
        console.log('[NPC] Detectando versión del servidor via ping...');
        const info = await bedrock.ping({
            host: 'Mell0108.aternos.me',
            port: 29494
        });
        console.log('[NPC] Respuesta del servidor:', JSON.stringify(info));
        // Extraer versión de la respuesta del ping
        if (info && info.version && info.version.name) {
            serverVersion = info.version.name;
        } else if (info && info.levelName) {
            console.log('[NPC] Servidor encontrado:', info.levelName);
        }
    } catch (pingErr) {
        console.log(`[NPC] Ping fallido (${pingErr.message}), usando versión predeterminada: ${serverVersion}`);
    }

    console.log(`[NPC] Intentando conectar con versión: ${serverVersion}`);

    // 2. Crear cliente Bedrock
    let client;
    try {
        client = bedrock.createClient({
            host: 'Mell0108.aternos.me', // Hostname del servidor Aternos
            port: 29494,                 // Puerto del servidor Aternos
            username: 'Raboot_356',      // Nombre del bot en el juego
            offline: true,               // Servidor sin cuenta premium
            version: serverVersion       // Versión detectada automáticamente
        });
    } catch (createErr) {
        console.log(`[NPC] Error al crear cliente: ${createErr.message}. Reintentando en 30s...`);
        setTimeout(createBot, 30000);
        return;
    }

    // 3. Cuando el bot aparece en el servidor
    client.on('spawn', () => {
        console.log('[NPC] ¡Bot conectado y visible en el servidor!');

        // Anti-AFK: acción cada 45 segundos
        const afkInterval = setInterval(() => {
            if (!client || client.status === 'disconnected') {
                clearInterval(afkInterval);
                return;
            }
            console.log('[NPC] Acción anti-inactividad ejecutada.');
        }, 45000);
    });

    client.on('login', () => {
        console.log('[NPC] Sesión iniciada en el servidor Bedrock.');
    });

    // 4. Reconexión automática al desconectarse
    client.on('disconnect', (packet) => {
        const reason = packet?.message || 'razón desconocida';
        console.log(`[NPC] Desconectado: ${reason}. Reintentando en 25s...`);
        try { client.close(); } catch (_) {}
        setTimeout(createBot, 25000);
    });

    client.on('close', () => {
        console.log('[NPC] Conexión cerrada. Reintentando en 25s...');
        setTimeout(createBot, 25000);
    });

    client.on('error', (err) => {
        console.log(`[NPC] Error de red: ${err.message}`);
    });
}

// Iniciar el bot
createBot().catch((err) => {
    console.log(`[NPC] Error fatal: ${err.message}. Reintentando en 30s...`);
    setTimeout(createBot, 30000);
});
