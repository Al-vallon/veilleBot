require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const { createDiscordClient } = require("./src/discordClient");
const NewsManager = require("./src/newsManager");
const keepAlive = require("./src/keepalive");

// Charger la configuration
const config = require("./config.json");

// Fonction pour obtenir une valeur de config (env en priorité, puis config.json)
function getConfigValue(envKey, configKey) {
    return process.env[envKey] || config[configKey];
}

// Vérification des variables de configuration
const token = getConfigValue('DISCORD_TOKEN', 'token');
const channelId = getConfigValue('DISCORD_CHANNEL_ID', 'channelId');

if (!token || token === "DISCORD_TOKEN") {
    console.error("Token Discord manquant");
    console.error("Ajoutez DISCORD_TOKEN dans le fichier .env ou remplacez 'DISCORD_TOKEN' dans config.json");
    process.exit(1);
}

if (!channelId || channelId === "DISCORD_CHANNEL_ID") {
    console.error("DISCORD_CHANNEL_ID manquant");
    console.error("Ajoutez DISCORD_CHANNEL_ID dans le fichier .env ou ajoutez 'channelId' dans config.json");
    process.exit(1);
}

// Initialisation
const client = createDiscordClient();
const newsManager = new NewsManager();
let newsChannel = null;

// Démarrer le serveur keepalive
keepAlive();

// Fonction pour démarrer la boucle de vérification des news
async function startNewsLoop() {
    try {
        newsChannel = await client.channels.fetch(channelId);
        console.log(`Canal de news configuré: #${newsChannel.name}`);
        
        // Première vérification immédiate
        await checkAndSendNews();
        
        // Puis vérification toutes les heures
        setInterval(async () => {
            await checkAndSendNews();
        }, 60 * 60 * 1000); // 1 heure
        
    } catch (error) {
        console.error("Erreur lors de la configuration du canal:", error.message);
    }
}

// Fonction pour vérifier et envoyer les news
async function checkAndSendNews() {
    try {
        console.log("Vérification des nouvelles...");
        const news = await newsManager.fetchNews();
        
        if (news.length === 0) {
            console.log("Aucune nouvelle trouvée");
            return;
        }

        console.log(`${news.length} nouvelle(s) trouvée(s)`);

        for (const item of news) {
            const embed = new EmbedBuilder()
                .setTitle(item.title.length > 256 ? item.title.substring(0, 253) + "..." : item.title)
                .setURL(item.link)
                .setDescription(
                    item.contentSnippet 
                        ? (item.contentSnippet.length > 300 
                            ? item.contentSnippet.substring(0, 297) + "..." 
                            : item.contentSnippet)
                        : "Aucune description disponible"
                )
                .setFooter({ 
                    text: `Source: ${item.source} | ${item.category || 'Général'}` 
                })
                .setColor(0x00b894)
                .setTimestamp(item.pubDate ? new Date(item.pubDate) : new Date());

            try {
                await newsChannel.send({ embeds: [embed] });
                console.log(`Article envoyé: ${item.title.substring(0, 50)}...`);
                
                // Petite pause entre les envois pour éviter le rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (sendError) {
                console.error(`Erreur lors de l'envoi:`, sendError.message);
            }
        }

    } catch (error) {
        console.error("Erreur lors de la vérification des news:", error.message);
    }
}

// Event handlers
client.once("ready", () => {
    console.log("Bot prêt ! Démarrage de la surveillance des news...");
    startNewsLoop();
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesse rejetée non gérée:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Exception non capturée:', error);
    process.exit(1);
});

// Connexion du bot
console.log("Connexion au bot Discord...");
client.login(token);
