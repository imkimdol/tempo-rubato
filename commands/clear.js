const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkChannelType, checkInVoice, checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            queue.clear();

            editReply(`Successfully cleared queue.`, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};