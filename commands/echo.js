const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats your input.')
        .addStringOption(option =>
            option.setName('input').setDescription('Enter text to echo.').setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            if (interaction.user.id === process.env.OWNER_ID) {
                const input = interaction.options.getString('input');
                interaction.editReply('Echoed.');
                interaction.channel.send(input);
                
            } else {
                interaction.editReply('You do not have permission.');
            }
            
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};