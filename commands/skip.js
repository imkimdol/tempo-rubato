const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }
            if (!client.queue || !client.queue.currentTrack) {
                return interaction.editReply('Bot is currently not playing.');
            }
            const track = client.queue.currentTrack;

            await client.playerNode.skip();
            
            interaction.editReply(`Skipped \`${track.title}\`.`);
        } catch (err) {
            interaction.editReply('An error occured!');
            console.error(err);
        }
    },
};