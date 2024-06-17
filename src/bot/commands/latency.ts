import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";

const data = new SlashCommandBuilder()
    .setName('latency')
    .setDescription('Checks the latency of the bot.');
module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const roundTrip = interaction.options.getBoolean('round_trip') ?? false;

        if (roundTrip) {
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
            interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
        } else {
            interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
        }
    }
};