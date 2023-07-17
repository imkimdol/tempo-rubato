const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require("discord-player");

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
            const player = useMainPlayer();
            const playResult = await player.play(
                interaction.member.voice.channel,
                search,
                {
                    requestedBy: interaction.user,
                    nodeOptions: {
                        metadata: interaction.channel
                    }
                },
            );

            const embed = new EmbedBuilder();
    
            embed.setTitle('Added to Queue')
                .setColor(0xDCD0FF)
                .addFields({ name: playResult.track.title, value: playResult.track.author })
                .setFooter({ text: `Queue Size: ${playResult.queue.size}` });

            const message = await interaction.editReply({ embeds: [embed] });
            if (client.timeout > 0) setTimeout(() => message.delete(), client.timeout);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};