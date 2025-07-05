// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

// Utiliser les variables d'environnement en priorité, puis config.json
const clientId = process.env.DISCORD_CLIENT_ID || config.clientId;
const guildId = process.env.DISCORD_GUILD_ID || config.guildId;
const token = process.env.DISCORD_TOKEN || config.token;

console.log('Configuration détectée:');
console.log('   Client ID:', clientId);
console.log('   Guild ID:', guildId);
console.log('   Token:', token ? 'OK Present' : 'ERREUR Manquant');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commandsModule = require(`./commands/${file}`);
    
    // Gérer le nouveau format (array de commandes)
    const commandsArray = Array.isArray(commandsModule) ? commandsModule : [commandsModule];
    
    for (const command of commandsArray) {
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Enregistrement des commandes slash...');
        
        // Essayer d'abord les commandes globales (prennent 1h à apparaître)
        console.log('Tentative d\'enregistrement global...');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('SUCCESS: Commandes globales enregistrées avec succès !');
        console.log('⏰ Les commandes apparaîtront dans ~1 heure');
        
    } catch (globalError) {
        console.log('ERREUR: Échec global, tentative sur le serveur...');
        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            console.log('SUCCESS: Commandes serveur enregistrées avec succès !');
        } catch (guildError) {
            console.error('ERREUR: Erreur lors de l\'enregistrement des commandes:');
            console.error('Global:', globalError.message);
            console.error('Guild:', guildError.message);
            console.log('\nAssurez-vous que votre bot est invité avec cette URL:');
            console.log(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=274877976576&scope=bot%20applications.commands`);
        }
    }
})();
