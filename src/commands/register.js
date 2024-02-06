const { SlashCommandBuilder } = require('discord.js');

const { handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a search query to your favourites.')
        .addIntegerOption(option =>
            option.setName('bank')
                .setDescription('Storage bank.')
                .setRequired(true)
                .addChoices(
                    { name: 'Bank 1', value: 1 },
                    { name: 'Bank 2', value: 2 },
                    { name: 'Bank 3', value: 3 },
                    { name: 'Bank 4', value: 4 },
                    { name: 'Bank 5', value: 5 },
                ))
        .addStringOption(option =>
            option.setName('query').setDescription('Enter search query.').setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const bank = interaction.options.getInteger('bank');
            const query = interaction.options.getString('query');

            await client.db.put([interaction.user.id, bank], query);
            interaction.editReply('Successfully added search query.');
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};