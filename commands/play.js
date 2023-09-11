const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require("discord-player");
const { getAverageColor } = require('fast-average-color-node');

const { checkChannelType, checkInVoice } = require('../helpers/check');
const { editReply, handleError, addRows } = require('../helpers/message');


const checkNoResult = (result) => typeof result === 'string' && result.equals('ERR_NO_RESULT');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Play using a search query. Separate by commas for multi-query.')
                .addStringOption(option =>
                    option.setName('query').setDescription('Enter search query.').setRequired(true)
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
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;
            if (!client.playRates[interaction.guild.id]) client.playRates[interaction.guild.id] = 1;
            
            let input;
            if (interaction.options.getSubcommand() === 'favourites') {
                const bank = interaction.options.getInteger('bank');
                try {
                    input = await client.db.get([interaction.user.id, bank]);
                } catch (err) {
                    console.error(err);
                    return editReply(`Failed to retrieve data from bank ${bank}.`, interaction, client);
                }
            } else {
                input = interaction.options.getString('query');
            }
            
            searches = input.split(/,\s*/);
            const player = useMainPlayer();
            const playResults = [];
            for (let search of searches) {
                try {
                    const playResult = await player.play(
                        interaction.member.voice.channel,
                        search,
                        {
                            requestedBy: interaction.user,
                            nodeOptions: {
                                metadata: interaction.channel,
                                skipOnNoStream: false
                            }
                        },
                    );
                    playResults.push(playResult);

                } catch (err) {
                    console.error(err);

                    if (err.name === 'ERR_NO_RESULT') {
                        playResults.push('ERR_NO_RESULT');
                    } else {
                        throw err;
                    }
                }
            }    

            const embed = new EmbedBuilder();
            const userImage = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`;
            const userColour = await getAverageColor(userImage);

            embed.setTitle('Added to Queue')
                .setColor(userColour.hex)
                .setFooter({ text: `Queue Size: ${playResults[0].queue.size}` });
            
            if (playResults.length === 1) {
                result = playResults[0];
                if (checkNoResult(result)) return editReply(`Found no results!`, interaction, client);
                embed.addFields({ name: result.track.title, value: result.track.author });
            } else if (playResults.length > 1) {
                let tracks = [];
                playResults.map((r) => {
                    if (!checkNoResult(r)) tracks = tracks.concat(r.track);
                });
                embed.addFields(...addRows(tracks, 12));
            } else {
                return editReply(`Failed to add songs.`, interaction, client);
            }

            editReply({ embeds: [embed] }, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};