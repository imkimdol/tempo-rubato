const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');


const trackToInlineField = (track, index) => {
    return { name: `${index+1}. ${track.title}`, value: track.author, inline: true };
};
const addRow = (tracks, start) => {
    const items = [];
    for (i=start; i<start+9; ++i) {
        if (tracks[i]) items.push(trackToInlineField(tracks[i], i));
    }
    return items;
}
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View queue.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            const embed = new EmbedBuilder();
            const loopModes = ['none', 'Track Loop', 'Queue Loop', 'Autoplay'];
            const tracks = queue.tracks.data;
            
            embed.setTitle(`Queue`)
                .setColor(0xDCD0FF)
                .setDescription(`${queue.size} Track(s) | Total Length: ${queue.durationFormatted}`);
                
            if (tracks.length > 0) embed.addFields(...addRow(tracks, 0));
            if (queue.repeatMode > 0) embed.setFooter({ text: `🔁 ${loopModes[queue.repeatMode]} Enabled` });
            
            editReply({ embeds: [embed] }, interaction, client);
            
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};