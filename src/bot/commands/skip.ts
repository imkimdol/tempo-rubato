import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";

const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips current song.');
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    const track = controller.skip();

    const reply = `Skipped ${track.title}.`;
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