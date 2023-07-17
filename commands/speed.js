const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

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
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel to play a song.');
            }

            const rate = interaction.options.getNumber('rate');
            if (rate < 0.5 || rate > 1.5) {
                return interaction.editReply('Playback rate is too extreme.');
            }

            const queue = useQueue(interaction.guild.id);
            client.playRate = rate;
            queue.filters.ffmpeg.setInputArgs(['-af', `aresample=48000,asetrate=48000*${rate}`]);
            queue.filters.ffmpeg.setFilters([]);

            const message = await interaction.editReply(`Set playback rate to ${rate}.`);
            if (client.timeout > 0) setTimeout(() => message.delete(), client.timeout);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};