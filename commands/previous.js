const { SlashCommandBuilder } = require('discord.js');
const { useHistory } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play previous track.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }

            const history = useHistory(interaction.guild.id);
            if (!history) return interaction.editReply('There is no playback history.');
            await history.previous();

            const message = await interaction.editReply(`Playing previous track!`);
            const timeout = parseInt(process.env.MESSAGE_TIMEOUT);
            if (timeout > 0) setTimeout(() => message.delete(), timeout);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};