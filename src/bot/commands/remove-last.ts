import { ChatInputCommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";
import { CommandOptionIsNullError } from "../../errors";
import { addRows } from "../helpers/message";

const nOptionName = 'n';
const data = new SlashCommandBuilder()
    .setName('remove-last')
    .setDescription('Sets playback rate.')
    .addNumberOption(option =>
        option.setName(nOptionName).setDescription('Number of songs to remove.').setRequired(true)
    );
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction, n: number): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    const tracks = controller.removeLast(n);

    // TODO clean up embed building
    const embed = new EmbedBuilder();
    embed.setTitle(`Removed ${n} Song(s)`)
        .setColor(0xDCD0FF)
        .addFields(...addRows(tracks, 12));
        
    const reply = { embeds: [embed] };
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const n = interaction.options.getNumber(nOptionName) ?? 1;

        try {
            handleCommand(interaction, i => callback(i, n), options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};