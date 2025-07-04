const { Client, GatewayIntentBits } = require('discord.js');
const { loadCommands, setupCommandHandler } = require('./commandHandler');

function createDiscordClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages
            // Note: MessageContent intent removed as it requires verification for bots in 100+ servers
            // Add it back if needed and verify your bot in Discord Developer Portal
        ]
    });

    // Charger les commandes slash
    loadCommands(client);
    
    // Configurer le gestionnaire de commandes
    setupCommandHandler(client);

    // Event handlers
    client.once('ready', () => {
        console.log(`🚀 Bot connecté en tant que ${client.user.tag}`);
        console.log(`📊 Connecté à ${client.guilds.cache.size} serveur(s)`);
        console.log(`⚡ ${client.commands.size} commande(s) disponible(s)`);
    });

    client.on('error', error => {
        console.error('❌ Erreur du client Discord:', error);
    });

    client.on('warn', warning => {
        console.warn('⚠️ Avertissement Discord:', warning);
    });

    return client;
}

module.exports = { createDiscordClient };
