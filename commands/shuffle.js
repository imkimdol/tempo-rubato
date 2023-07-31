const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { checkInVoice, checkPlaying } = require('../helpers/check');
const { editReply, handleError } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle queue.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!checkInVoice(interaction, client)) return;
            if (!checkPlaying(interaction, client)) return;

            const queue = useQueue(interaction.guild.id);
            queue.tracks.shuffle();
            
            editReply(`Shuffled queue.`, interaction, client);
        } catch (err) {
            handleError(err, interaction, client);
        }
    },
};