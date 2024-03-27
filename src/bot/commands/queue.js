const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkChannelType, checkPlaying } = require('../helpers/check');
const { editReply, handleError, addRows } = require('../helpers/message');

 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View queue.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            const embed = new EmbedBuilder();
            const loopModes = ['none', 'Track Loop', 'Queue Loop', 'Autoplay'];
            const tracks = queue.tracks.data;
            
            embed.setTitle(`Queue`)
                .setColor(0xDCD0FF)
                .setDescription(`${queue.size} Track(s) | Total Length: ${queue.durationFormatted}`);
                
            if (tracks.length > 0) embed.addFields(...addRows(tracks, 12, true));
            if (queue.repeatMode > 0) embed.setFooter({ text: `🔁 ${loopModes[queue.repeatMode]} Enabled` });

            editReply({ embeds: [embed] }, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};