const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require("discord-player");
const { getAverageColor } = require('fast-average-color-node');

const { checkInVoice } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');

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
            if (!checkInVoice(interaction, client)) return;

            let search;
            if (interaction.options.getSubcommand() === 'favourites') {
                const bank = interaction.options.getInteger('bank');
                try {
                    search = await client.db.get([interaction.user.id, bank]);
                } catch (err) {
                    console.error(err);
                    return interaction.editReply(`Failed to retrieve data from bank ${bank}.`);
                }
            } else {
                search = interaction.options.getString('search');
            }
            
            const player = useMainPlayer();
            let playResult;
            try {
                playResult = await player.play(
                    interaction.member.voice.channel,
                    search,
                    {
                        requestedBy: interaction.user,
                        nodeOptions: {
                            metadata: interaction.channel
                        }
                    },
                );
            } catch (err) {
                if (err.name === 'ERR_NO_RESULT') {
                    return interaction.editReply(`Found no results!`);
                }
                throw err;
            }
            
            const embed = new EmbedBuilder();
            const userImage = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`;
            const userColour = await getAverageColor(userImage);
    
            embed.setTitle('Added to Queue')
                .setColor(userColour.hex)
                .addFields({ name: playResult.track.title, value: playResult.track.author })
                .setFooter({ text: `Queue Size: ${playResult.queue.size}` });

            editReply({ embeds: [embed] }, interaction, client);

        } catch (err) {
            handleError(err, interaction, client)
        }
    },
};