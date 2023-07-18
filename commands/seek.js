const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

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
            if (!interaction.member.voice.channel) {
                return interaction.editReply('You need to be in a Voice Channel to play a song.');
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue) return interaction.editReply('Bot is currently not playing.');

            const location = interaction.options.getInteger('location');
            if (location * 1000 >= queue.currentTrack.durationMS) {
                await queue.node.seek(queue.currentTrack.durationMS);
            } else {
                await queue.node.seek(location * 1000);
            }

            const message = await interaction.editReply(`Set seek location to \`${location}\` seconds.`);
            if (client.timeout > 0) setTimeout(() => message.delete(), client.timeout);
        } catch (err) {
            interaction.editReply(process.env.ERROR_MESSAGE);
            console.error(err);
        }
    },
};