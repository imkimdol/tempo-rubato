const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { editReply, handleError } = require('../helpers/message');

const loopModes = ['off', 'track', 'queue', 'autoplay'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set loop mode.')
        .addIntegerOption(option =>
            option.setName('mode')
                .setDescription('Loop mode.')
                .setRequired(true)
                .addChoices(
                    { name: loopModes[0], value: 0 },
                    { name: loopModes[1], value: 1 },
                    { name: loopModes[2], value: 2 },
                    { name: loopModes[3], value: 3 },
                )),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue) return interaction.editReply('Bot is currently not playing.');

            const mode = interaction.options.getInteger('mode');
            queue.setRepeatMode(mode);

            editReply(`Set loop mode to \`${loopModes[mode]}\`.`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};