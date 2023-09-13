const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require("discord-player");
const { getAverageColor } = require('fast-average-color-node');

const { checkChannelType, checkInVoice, } = require('../helpers/check');
const { editReply, handleError, addRows } = require('../helpers/message');


const checkNoResult = (result) => typeof result === 'string' && result === 'ERR_NO_RESULT';

const runPlay = async (input, interaction) => {
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
                    connectionOptions: {
                        deaf: false,
                    },
                    nodeOptions: {
                        metadata: interaction.channel,
                        bufferingTimeout: 10000,
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

    return playResults;
};

const runSearch = async (input, interaction) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue) return runPlay(input);

    const player = useMainPlayer();
    try {
        const searchResult = await player.search(input, { requestedBy: interaction.user });
        console.log(searchResult);

        queue.insertTrack(searchResult.tracks[0], 0);
        return searchResult.tracks[0];

    } catch (err) {
        console.error(err);

        if (err.name === 'ERR_NO_RESULT' || err.name === 'ERR_INVALID_ARG_TYPE') {
            return 'ERR_NO_RESULT';
        } else {
            throw err;
        }
    }
}


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
                .setName('next')
                .setDescription('Play next in queue using a search query. Limited to one song.')
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

            
            let results;
            if (interaction.options.getSubcommand() === 'next') {
                results = await runSearch(input, interaction);
            } else {
                results = await runPlay(input, interaction);
            }

            const embed = new EmbedBuilder();
            const userImage = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`;
            const userColour = await getAverageColor(userImage);
            const queue = useQueue(interaction.guild.id);

            
            
            if (interaction.options.getSubcommand() === 'next') {
                const result = results;
                if (checkNoResult(result)) return editReply(`Found no results!`, interaction, client);

                embed.setTitle('Added to Front of Queue')
                    .setColor(userColour.hex)
                    .setFooter({ text: `Queue Size: ${queue.size}` })
                    .addFields({ name: result.title, value: result.author });

            } else {
                embed.setTitle('Added to Queue')
                    .setColor(userColour.hex)

                if (results.length === 1) {
                    const result = results[0];
                    if (checkNoResult(result)) return editReply(`Found no results!`, interaction, client);
                    embed.addFields({ name: result.track.title, value: result.track.author });
                } else if (results.length > 1) {
                    let tracks = [];
                    results.map((r) => {
                        if (!checkNoResult(r)) tracks = tracks.concat(r.track);
                    });
                    embed.addFields(...addRows(tracks, 12));
                } else {
                    return editReply(`Failed to add songs.`, interaction, client);
                }

                embed.setFooter({ text: `Queue Size: ${queue.size}` });
            }
            
            editReply({ embeds: [embed] }, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};