const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '../commands');
    
    // Vérifier si le dossier commands existe
    if (!fs.existsSync(commandsPath)) {
        console.log('⚠️ Le dossier commands n\'existe pas encore');
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log(`📂 Chargement de ${commandFiles.length} commande(s)...`);

    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Commande "${command.data.name}" chargée`);
            } else {
                console.log(`⚠️ La commande "${file}" n'a pas la structure requise`);
            }
        } catch (error) {
            console.error(`❌ Erreur lors du chargement de "${file}":`, error.message);
        }
    }
}

function setupCommandHandler(client) {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.log(`❌ Commande "${interaction.commandName}" introuvable`);
            return;
        }

        try {
            console.log(`🎯 Exécution de la commande "${interaction.commandName}" par ${interaction.user.tag}`);
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Erreur lors de l'exécution de "${interaction.commandName}":`, error);
            
            const errorMessage = 'Une erreur est survenue lors de l\'exécution de cette commande.';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    });
}

module.exports = { loadCommands, setupCommandHandler };
