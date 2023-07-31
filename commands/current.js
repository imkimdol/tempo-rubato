const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAverageColor } = require('fast-average-color-node');

const { checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('View currently playing song.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkPlaying(interaction, client)) return;

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
            
            editReply({ embeds: [embed] }, interaction, client, 2);
        } catch (err) {
            handleError(err, interaction, client)
        }
    },
};