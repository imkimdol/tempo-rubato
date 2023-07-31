const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { editReply, handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle queue.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue) return interaction.editReply('Bot is currently not playing.');

            queue.tracks.shuffle();
            
            editReply(`Shuffled queue.`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};