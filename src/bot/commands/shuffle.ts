import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";

const data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue.');
const options: HandleCommandOptions = {
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    controller.shuffle();

    const reply = 'Shuffled queue.';
    return reply;
};

module.exports = {
    data: data ,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        try {
            handleCommand(interaction, callback, options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};