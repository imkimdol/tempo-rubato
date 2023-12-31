const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkChannelType, checkInVoice } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('speed')
        .setDescription('Set playback rate.')
        .addNumberOption(option =>
            option.setName('rate').setDescription('Playback rate.').setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkChannelType(interaction, client)) return;
            if (!checkInVoice(interaction, client)) return;

            const rate = interaction.options.getNumber('rate');
            if (rate < 0.5 || rate > 2.0) {
                return interaction.editReply('Playback rate is too extreme.');
            }

            const queue = useQueue(interaction.guild.id);
            client.playRates[interaction.guild.id] = rate;
            if (queue) {      
                queue.filters.ffmpeg.setInputArgs(['-af', `aresample=48000,asetrate=48000*${rate}`]);
                queue.filters.ffmpeg.setFilters([]);
            }

            editReply(`Set playback rate to \`${rate}x\`.`, interaction, client);

        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};