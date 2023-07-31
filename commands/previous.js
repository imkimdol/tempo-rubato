const { SlashCommandBuilder } = require('discord.js');
const { useHistory } = require("discord-player");

const { checkInVoice, checkPlaying, checkHistory } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play previous track.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;
            if (!checkHistory(interaction, client)) return;

            const history = useHistory(interaction.guild.id);
            await history.previous();

            editReply(`Playing previous track!`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};