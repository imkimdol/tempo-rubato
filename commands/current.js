const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAverageColor } = require('fast-average-color-node');
const { useQueue } = require('discord-player');

const { checkChannelType, checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('View currently playing song.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;
            
            const queue = useQueue(interaction.guild.id);
            const track = queue.currentTrack;
            const user = interaction.user;
            const progressBar = queue.node.createProgressBar({
                queue: false,
                separator: ' '
            });
            const footerText = `${progressBar}\nRequested by ${user.username} | ${client.playRates[interaction.guild.id]}x`;
            
            const embed = new EmbedBuilder();
            embed.setTitle(track.title)
                .setURL(track.url)
                .setAuthor({ name: 'Currently Playing' })
                .setDescription(track.author)
                .setFooter({ text: footerText, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` });
            
            try {
                const songColour = await getAverageColor(track.thumbnail);
                embed.setColor(songColour.hex).setThumbnail(track.thumbnail);
            } catch {
                embed.setColor(0xDCD0FF);
            }

            editReply({ embeds: [embed] }, interaction, client, 2);
        } catch (err) {
            handleError(err, interaction, client)
        }
    },
};