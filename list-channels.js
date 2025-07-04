// list-channels.js - Script pour lister les canaux disponibles
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const token = process.env.DISCORD_TOKEN || config.token;
const guildId = process.env.DISCORD_GUILD_ID || config.guildId;

client.once('ready', async () => {
    console.log(`🤖 Connecté en tant que ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(guildId);
        console.log(`\n📋 Canaux disponibles sur "${guild.name}":`);
        console.log('=' .repeat(50));
        
        const channels = await guild.channels.fetch();
        
        channels.forEach(channel => {
            if (channel.type === 0) { // Canal textuel
                console.log(`📝 ${channel.name}`);
                console.log(`   ID: ${channel.id}`);
                console.log(`   Type: Canal textuel`);
                console.log('');
            }
        });
        
        console.log('💡 Copiez l\'ID du canal souhaité et mettez-le dans DISCORD_CHANNEL_ID');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
    
    client.destroy();
});

client.login(token);
