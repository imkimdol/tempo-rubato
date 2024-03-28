import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";
import { CommandOptionIsNullError } from "../../errors";

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
    controller.playbackSpeed(n);

    const reply = `Removed ${n} song(s).`;

    // TODO embed for removed songs
    // const embed = new EmbedBuilder();
    // embed.setTitle(`Removed ${n} Song(s)`)
    //     .setColor(0xDCD0FF)
    //     .addFields(...addRows(tracks, 12));
        
    // editReply({ embeds: [embed] }, interaction, client);

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