import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";
import { CommandOptionIsNullError } from "../../errors";

const locationOptionName = 'location';
const data = new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Begins playing at specified location.')
    .addNumberOption(option =>
        option.setName(locationOptionName).setDescription('Seek location (seconds).').setRequired(true)
    );
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction, location: number): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    await controller.seek(location);

    const reply = `Playing from \`${location}\` seconds.`;
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const location = interaction.options.getNumber(locationOptionName);
        if (!location) throw new CommandOptionIsNullError(locationOptionName);

        try {
            handleCommand(interaction, i => callback(i, location), options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};