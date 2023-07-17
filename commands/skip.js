const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction, client) {
        try {
            if (!interaction.member.voice.channel) {
                return interaction.reply('You need to be in a Voice Channel.');
            }
            if (!client.queue || !client.queue.currentTrack) {
                return interaction.reply('Bot is currently not playing.');
            }
            const track = client.queue.currentTrack;

            await client.playerNode.skip();
            
            interaction.reply(`Skipped \`${track.title}\`.`);
        } catch (err) {
            interaction.reply('An error occured!');
            console.error(err);
        }
    },
};