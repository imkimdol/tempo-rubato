const { SlashCommandBuilder } = require('discord.js');
const { useHistory } = require("discord-player");

const { checkChannelType, checkInVoice, checkPlaying, checkHistory } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play previous track.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;
            if (!checkHistory(interaction, client)) return;

            const history = useHistory(interaction.guild.id);
            
            try {
                await history.previous();
            } catch (err) {
                if (err.name === 'ERR_NO_RESULT') return editReply('There is no history.', interaction, client)
                throw err;
            }

            editReply(`Playing previous track!`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};