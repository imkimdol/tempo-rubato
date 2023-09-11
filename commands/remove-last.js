const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkChannelType, checkInVoice, checkPlaying } = require('../helpers/check');
const { editReply, handleError, addRows } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-last')
        .setDescription('Removes the last n songs from the queue.')
        .addIntegerOption(option =>
            option.setName('n')
                .setDescription('Number of songs to remove.')),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            const length = queue.size;
            const n = interaction.options.getInteger('n') ?? 1;
            
            if (length < n || n < 1) {
                return editReply('Invalid input number.', interaction, client);
            }

            const tracks = queue.tracks.toArray().slice(length-n, length);
            for (let track of tracks) {
                queue.removeTrack(track);
            }

            const embed = new EmbedBuilder();
            embed.setTitle(`Removed ${n} Song(s)`)
                .setColor(0xDCD0FF)
                .addFields(...addRows(tracks, 12));
            
            editReply({ embeds: [embed] }, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};