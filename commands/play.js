const { SlashCommandBuilder } = require('discord.js');

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

            const search = interaction.options.getString('search');
            const playResult = await client.player.play(
                interaction.member.voice.channel,
                search,
                { requestedBy: interaction.user }
            );

            interaction.editReply(`Added \`${playResult.track.title}\` to queue!\nQueue length: \`${playResult.queue.size + 1}\``);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};