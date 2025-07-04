// commands/reset-date.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
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
            
            await interaction.editReply(`✅ Date de démarrage réinitialisée à: ${now.toLocaleString('fr-FR')}\n📝 Seuls les nouveaux articles après cette date seront notifiés.`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la réinitialisation:', error);
            await interaction.editReply('❌ Erreur lors de la réinitialisation de la date.');
        }
    },
};
