import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";
import { CommandOptionIsNullError } from "../../errors";

const rateOptionName = 'rate';
const data = new SlashCommandBuilder()
    .setName('speed')
    .setDescription('Sets playback rate.')
    .addNumberOption(option =>
        option.setName(rateOptionName).setDescription('Playback rate.').setRequired(true)
    );
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction, rate: number): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    await controller.playbackSpeed(rate);

    const reply = `Set playback rate to \`${rate}x\`.`;
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const rate = interaction.options.getNumber(rateOptionName);
        if (!rate) throw new CommandOptionIsNullError(rateOptionName);

        try {
            handleCommand(interaction, i => callback(i, rate), options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};