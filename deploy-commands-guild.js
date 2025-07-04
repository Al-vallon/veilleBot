// deploy-commands-guild.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

// Utiliser les variables d'environnement en priorité, puis config.json
const clientId = process.env.DISCORD_CLIENT_ID || config.clientId;
const guildId = process.env.DISCORD_GUILD_ID || config.guildId;
const token = process.env.DISCORD_TOKEN || config.token;

console.log('🔧 Configuration détectée:');
console.log('   Client ID:', clientId);
console.log('   Guild ID:', guildId);
console.log('   Token:', token ? '✅ Présent' : '❌ Manquant');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Enregistrement des commandes slash sur le serveur...');
        
        // Assurez-vous que le bot est dans le serveur d'abord
        console.log('📋 Vérification de l\'accès au serveur...');
        
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('✅ Commandes serveur enregistrées avec succès !');
        console.log('🚀 Les commandes sont disponibles immédiatement !');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement sur le serveur:');
        console.error('Code d\'erreur:', error.code);
        console.error('Message:', error.message);
        
        if (error.code === 50001) {
            console.log('\n🔗 Votre bot n\'est pas invité sur le serveur ou n\'a pas les bonnes permissions.');
            console.log('Utilisez cette URL pour l\'inviter:');
            console.log(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=274877976576&scope=bot%20applications.commands`);
        }
    }
})();
