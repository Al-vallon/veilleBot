// commands/stats.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Affiche les statistiques du bot de veille'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const configPath = path.join(__dirname, "../bot-config.json");
            const feedsPath = path.join(__dirname, "../feeds.json");
            
            let startupDate = "Non définie";
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
                if (config.startupDate) {
                    startupDate = new Date(config.startupDate).toLocaleString('fr-FR');
                }
            }
            
            let totalFeeds = 0;
            if (fs.existsSync(feedsPath)) {
                const feeds = JSON.parse(fs.readFileSync(feedsPath, "utf-8"));
                totalFeeds = feeds.length;
            }

            const embed = new EmbedBuilder()
                .setTitle('📊 Statistiques VeilleBot')
                .setColor(0x00b894)
                .addFields(
                    { name: '📰 Flux RSS surveillés', value: totalFeeds.toString(), inline: true },
                    { name: '📅 Date de démarrage', value: startupDate, inline: true },
                    { name: '⚡ Fréquence de vérification', value: 'Toutes les heures', inline: true },
                    { name: '🤖 Statut', value: 'En ligne et actif', inline: true },
                    { name: '💡 Commandes disponibles', value: '`/veille` - `/stats` - `/reset-date`', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'VeilleBot - Surveillance RSS automatisée' });

            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des stats:', error);
            await interaction.editReply('❌ Erreur lors de la récupération des statistiques.');
        }
    },
};
