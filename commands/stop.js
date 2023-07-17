const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playback.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }
            if (!client.queue || !client.queue.currentTrack) {
                return interaction.editReply('Bot is currently not playing.');
            }

            await client.playerNode.stop(true);
            
            interaction.editReply(`Stopped playback.`);
        } catch (err) {
            interaction.editReply('An error occured!');
            console.error(err);
        }
    },
};