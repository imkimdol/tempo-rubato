const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

const { editReply } = require('../helpers/message');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel.');
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue) return interaction.editReply('Bot is currently not playing.');

            const track = queue.currentTrack;
            queue.node.skip();

            editReply(`Skipped ${track.title}.`, interaction, client);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};