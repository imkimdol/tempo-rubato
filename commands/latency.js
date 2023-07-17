const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('latency')
        .setDescription('Checks the latency of the bot.')
        .addBooleanOption(option =>
            option
                .setName('round_trip')
                .setDescription('If the check should measure the round trip latency.')),
    async execute(interaction, client) {
        const roundTrip = interaction.options.getBoolean('round_trip') ?? false;

        if (roundTrip) {
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
            interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
        } else {
            interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
        }
    },
};