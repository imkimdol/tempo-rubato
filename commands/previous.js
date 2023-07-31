const { SlashCommandBuilder } = require('discord.js');
const { useHistory } = require("discord-player");

const { editReply, handleError } = require('../helpers/message');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play previous track.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }

            const history = useHistory(interaction.guild.id);
            if (!history) return interaction.editReply('There is no playback history.');
            await history.previous();

            editReply(`Playing previous track!`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};