require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fetchNews = require("./rss");
const keepAlive = require("./keepalive");

keepAlive();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once("ready", () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    startNewsLoop();
});

async function startNewsLoop() {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

    setInterval(async () => {
    const news = await fetchNews();
    for (const item of news) {
        const embed = new EmbedBuilder()
            .setTitle(item.title)
            .setURL(item.link)
            .setDescription(item.contentSnippet?.substring(0, 200) + "...")
            .setFooter({ text: `Source: ${item.source}` })
            .setColor(0x00b894);
        await channel.send({ embeds: [embed] });
        }
    }, 60 * 60 * 1000); // Toutes les heures
}

keepAlive();
client.login(process.env.DISCORD_TOKEN);
