import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { CommandOptionIsNullError, InvalidValueError } from "../../errors";
import { QueueRepeatMode } from "discord-player";
import { PlayerController } from "../../controller/PlayerController";

const repeatModeNames = ['off', 'track', 'queue', 'autoplay'];
const modeOptionName = 'mode';
const data = new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Sets repeat mode.')
    .addIntegerOption(option =>
        option.setName(modeOptionName)
            .setDescription('Repeat mode.')
            .setRequired(true)
            .addChoices(
                { name: repeatModeNames[0], value: 0 },
                { name: repeatModeNames[1], value: 1 },
                { name: repeatModeNames[2], value: 2 },
                { name: repeatModeNames[3], value: 3 },
            ))
const options: HandleCommandOptions = {
    ephemeral: true,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction, mode: QueueRepeatMode): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    controller.setRepeatMode(mode);

    const reply = `Set loop mode to \`${repeatModeNames[mode]}\`.`;
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const mode = interaction.options.getNumber(modeOptionName);
        if (!mode) throw new CommandOptionIsNullError(modeOptionName);
        if (!(mode in QueueRepeatMode)) throw new InvalidValueError('Mode index is out of expected range (0-3).');

        try {
            handleCommand(interaction, i => callback(i, mode), options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};