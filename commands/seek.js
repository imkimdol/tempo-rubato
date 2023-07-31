const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkChannelType, checkInVoice, checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a new location in the song.')
        .addIntegerOption(option =>
            option.setName('location').setDescription('Seek location (seconds).').setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            const location = interaction.options.getInteger('location');
            if (location * 1000 >= queue.currentTrack.durationMS) {
                await queue.node.seek(queue.currentTrack.durationMS);
            } else {
                await queue.node.seek(location * 1000);
            }
            
            editReply(`Set seek location to \`${location}\` seconds.`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client)
        }
    },
};