const { SlashCommandBuilder } = require('discord.js');
const { GuildQueuePlayerNode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song.')
        .addStringOption(option =>
            option.setName('search').setDescription('Enter search query.').setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel to play a song.');
            }

            const input = interaction.options.getString('input');

            const playResult = await client.player.play(
                interaction.member.voice.channel,
                input,
                { requestedBy: interaction.user }
            );
            if (!client.queue) client.queue = playResult.queue;
            if (!client.playerNode) client.playerNode = new GuildQueuePlayerNode(client.queue);
        
            interaction.editReply(`Added \`${playResult.track.title}\` to queue!\nQueue length: \`${client.queue.size + 1}\``);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};