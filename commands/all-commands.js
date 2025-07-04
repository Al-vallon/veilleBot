// commands/all-commands.js - Toutes les commandes du bot regroupées
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const NewsManager = require('../src/newsManager');
const fs = require('fs');
const path = require('path');

// Commande principale de veille
const veilleCommand = {
    data: new SlashCommandBuilder()
        .setName('veille')
        .setDescription("Lance la veille manuellement et affiche les dernières news"),

    async execute(interaction) {
        await interaction.deferReply();

        const newsManager = new NewsManager();
        const news = await newsManager.fetchNews();

        if (news.length === 0) {
            return interaction.editReply("Rien de nouveau pour le moment !");
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

        await interaction.editReply(`${news.length} nouvelle(s) info(s) partagée(s) !`);
    },
};

// Commande de statistiques
const statsCommand = {
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
                .setTitle('Statistiques VeilleBot')
                .setColor(0x00b894)
                .addFields(
                    { name: 'Flux RSS', value: totalFeeds.toString(), inline: true },
                    { name: 'Démarrage', value: startupDate, inline: true },
                    { name: 'Vérification', value: 'Toutes les heures', inline: true },
                    { name: 'Statut', value: 'En ligne', inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            await interaction.editReply('Erreur lors de la récupération des statistiques.');
        }
    },
};

// Commande pour réinitialiser la date
const resetCommand = {
    data: new SlashCommandBuilder()
        .setName('reset-date')
        .setDescription('Réinitialise la date de démarrage du bot à maintenant'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const configPath = path.join(__dirname, "../bot-config.json");
            const now = new Date();
            const config = { startupDate: now.toISOString() };
            
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            
            await interaction.editReply(`Date réinitialisée à: ${now.toLocaleString('fr-FR')}`);
            
        } catch (error) {
            await interaction.editReply('Erreur lors de la réinitialisation.');
        }
    },
};

module.exports = [veilleCommand, statsCommand, resetCommand];
