const { Client, GatewayIntentBits, ChannelType, Collection } = require('discord.js');

require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Fake server for Render port trouble
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

const fs = require('fs');
const path = require('path');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});



function keepAlive() {
    const app = express();
    const PORT = process.env.PORT || 8080;

    app.get('/', (req, res) => {
        res.send('Le bot Discord fonctionne.');
    });

    app.listen(PORT, () => {
        console.log(`🟢 Keepalive actif sur le port ${PORT}`);
    });
}


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Erreur pendant l’exécution de la commande.', ephemeral: true });
    }
});



module.exports = keepAlive;