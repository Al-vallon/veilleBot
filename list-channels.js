// list-channels.js - Script pour lister les canaux disponibles
require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
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
        console.log('=' .repeat(60));
        
        const channels = await guild.channels.fetch();
        
        channels.forEach(channel => {
            if (channel.type === ChannelType.GuildText) { // Canal textuel uniquement
                console.log(`📝 #${channel.name}`);
                console.log(`   ID: ${channel.id}`);
                console.log(`   Position: ${channel.position}`);
                console.log('');
            }
        });
        
        console.log('💡 Copiez l\'ID du canal souhaité et remplacez DISCORD_CHANNEL_ID dans .env');
        console.log('\nExemple dans .env :');
        console.log('DISCORD_CHANNEL_ID=1234567890123456789');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
    
    process.exit(0);
});

client.login(token);
