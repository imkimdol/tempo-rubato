const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

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
            const queue = useQueue(interaction.guild.id);
            if (!queue) return interaction.editReply('Bot is currently not playing.');

            const embed = new EmbedBuilder();
            const loopModes = ['none', 'Track Loop', 'Queue Loop', 'Autoplay'];
            const tracks = queue.tracks.data;
            
            embed.setTitle(`Queue`)
                .setColor(0xDCD0FF)
                .setDescription(`${queue.size} Track(s) | Total Length: ${queue.durationFormatted}`);
                
            if (tracks.length > 0) embed.addFields(...addRow(tracks, 0));
            if (queue.repeatMode > 0) embed.setFooter({ text: `🔁 ${loopModes[queue.repeatMode]} Enabled` });
            
            const message = await interaction.editReply({ embeds: [embed] });
            if (client.timeout > 0) setTimeout(() => message.delete(), client.timeout);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};