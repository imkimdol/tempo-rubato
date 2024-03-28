import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";

const data = new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Plays previous track.');
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: true,
    timeoutMultiplier: 2
};
async function callback(interaction: ChatInputCommandInteraction): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    const track = await controller.previous();

    const reply = `Skipping ${track.title} and playing previous track.`;
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        try {
            handleCommand(interaction, callback, options)
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};