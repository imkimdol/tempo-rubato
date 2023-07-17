const { SlashCommandBuilder } = require('discord.js');
const { GuildQueuePlayerNode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song.')
        .addStringOption(option =>
            option.setName('input').setDescription('Enter song to play.').setRequired(true)
        ),
    async execute(interaction, client) {
        try {
            if (!interaction.member.voice.channel) {
                return interaction.reply('You need to be in a Voice Channel to play a song.');
            }

            const input = interaction.options.getString('input');

            const playResult = await client.player.play(
                interaction.member.voice.channel,
                input,
                { requestedBy: interaction.user }
            );
            if (!client.queue) client.queue = playResult.queue;
            if (!client.playerNode) client.playerNode = new GuildQueuePlayerNode(client.queue);
        
            interaction.reply(`Added \`${playResult.track.title}\` to queue!\nQueue length: \`${client.queue.size + 1}\``);
        } catch (err) {
            interaction.reply('An error occured while trying to play song!');
            console.error(err);
        }
    },
};