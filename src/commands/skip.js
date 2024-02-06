const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkChannelType, checkInVoice, checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            const track = queue.currentTrack;
            queue.node.skip();

            editReply(`Skipped ${track.title}.`, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};