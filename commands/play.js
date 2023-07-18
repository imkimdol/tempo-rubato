const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Play using a search query.')
                .addStringOption(option =>
                    option.setName('search').setDescription('Enter search query.').setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('favourites')
                .setDescription('Play from your favourites.')
                .addIntegerOption(option =>
                    option.setName('bank')
                        .setDescription('Storage bank.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Bank 1', value: 1 },
                            { name: 'Bank 2', value: 2 },
                            { name: 'Bank 3', value: 3 },
                            { name: 'Bank 4', value: 4 },
                            { name: 'Bank 5', value: 5 },
                 ))),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel to play a song.');
            }

            let search;
            if (interaction.options.getSubcommand() === 'favourites') {
                const bank = interaction.options.getInteger('bank');
                try {
                    search = await client.db.get([interaction.user.id, bank]);
                } catch (err) {
                    console.error(err);
                    return interaction.editReply(`Failed to retrieve data from bank ${bank+1}.`);
                }
            } else {
                interaction.options.getString('search');
            }

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