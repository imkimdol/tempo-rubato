const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useHistory, useQueue } = require("discord-player");

const { checkChannelType, checkPlaying, checkHistory } = require('../helpers/check');
const { editReply, handleError, addRows } = require('../helpers/message');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('View playback history.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;
            if (!checkHistory(interaction, client)) return;

            const embed = new EmbedBuilder();
            const queue = useQueue(interaction.guild.id);
            const history = useHistory(interaction.guild.id);
            const tracks = history.tracks.data;
            const loopModes = ['none', 'Track Loop', 'Queue Loop', 'Autoplay'];
            
            embed.setTitle(`History`)
                .setColor(0xDCD0FF)
                
            if (tracks.length > 0) embed.addFields(...addRows(tracks, 12));
            if (queue.repeatMode > 0) embed.setFooter({ text: `🔁 ${loopModes[queue.repeatMode]} Enabled` });

            editReply({ embeds: [embed] }, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};