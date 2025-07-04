// commands/veille.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const NewsManager = require('../src/newsManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('veille')
        .setDescription("Lance la veille manuellement et t'affiche les dernières news"),

    async execute(interaction) {
        await interaction.deferReply();

        const newsManager = new NewsManager();
        const news = await newsManager.fetchNews();

        if (news.length === 0) {
        return interaction.editReply("📰 Rien de nouveau pour le moment !");
        }

        for (const item of news) {
        const embed = new EmbedBuilder()
            .setTitle(item.title)
            .setURL(item.link)
            .setDescription(item.contentSnippet?.substring(0, 200) + "...")
            .setFooter({ text: `Source: ${item.source}` })
            .setColor(0x3498db);
        
        await interaction.channel.send({ embeds: [embed] });
        }

        await interaction.editReply(`✅ ${news.length} nouvelle(s) info(s) partagée(s) !`);
    },
};
