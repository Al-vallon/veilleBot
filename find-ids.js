// find-ids.js - Script pour trouver les bons IDs Discord
require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const token = process.env.DISCORD_TOKEN || config.token;

client.once('ready', async () => {
    console.log(`🤖 Connecté en tant que ${client.user.tag}`);
    console.log(`🆔 Client ID (Application ID): ${client.user.id}`);
    console.log('');
    
    console.log('📋 Serveurs où votre bot est présent:');
    console.log('=' .repeat(60));
    
    const guilds = client.guilds.cache;
    
    for (const [guildId, guild] of guilds) {
        console.log(`🏠 Serveur: "${guild.name}"`);
        console.log(`   🆔 Guild ID: ${guild.id}`);
        console.log(`   👥 Membres: ${guild.memberCount}`);
        
        try {
            const channels = await guild.channels.fetch();
            console.log('   📝 Canaux textuels:');
            
            channels.forEach(channel => {
                if (channel.type === ChannelType.GuildText) {
                    console.log(`      #${channel.name} → ID: ${channel.id}`);
                }
            });
        } catch (error) {
            console.log('   ❌ Impossible de lister les canaux');
        }
        
        console.log('');
    }
    
    console.log('💡 Pour configurer votre .env :');
    console.log('DISCORD_CLIENT_ID=' + client.user.id);
    console.log('DISCORD_GUILD_ID=<ID_DU_SERVEUR_CHOISI>');
    console.log('DISCORD_CHANNEL_ID=<ID_DU_CANAL_CHOISI>');
    
    process.exit(0);
});

client.login(token);
