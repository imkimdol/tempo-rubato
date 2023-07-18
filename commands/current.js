const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { getAverageColor } = require('fast-average-color-node');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('View currently playing song.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }
            
            const queue = useQueue(interaction.guild.id);
            if (!queue) return interaction.editReply('Bot is currently not playing.');

            const track = queue.currentTrack;
            const user = interaction.user;
            const songColour = await getAverageColor(track.thumbnail);
            const progressBar = queue.node.createProgressBar({
                queue: false,
                separator: ' '
            });
            
            const embed = new EmbedBuilder();
            embed.setTitle(track.title)
                .setColor(songColour.hex)
                .setURL(track.url)
                .setAuthor({ name: 'Currently Playing' })
                .setDescription(track.author)
                .setThumbnail(track.thumbnail)
                .setFooter({ text: `${progressBar}\nRequested by ${user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` });
            
            const message = await interaction.editReply({ embeds: [embed] });
            if (client.timeout > 0) setTimeout(() => message.delete(), client.timeout*2);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};