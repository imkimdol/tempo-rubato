import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";
import { addRows } from "../helpers/message";

const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View queue.');
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: false,
    timeoutMultiplier: 2
};
async function callback(interaction: ChatInputCommandInteraction): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);

    // TODO clean up embed building
    const queue = controller.getQueue();
    const history = controller.getHistory();
    const tracks = history.tracks.data;
    const loopModes = ['none', 'Track Loop', 'Queue Loop', 'Autoplay'];
    const embed = new EmbedBuilder();
    embed.setTitle(`Queue`)
        .setColor(0xDCD0FF)
        .setDescription(`${queue.size} Track(s) | Total Length: ${queue.durationFormatted}`);
    if (tracks.length > 0) embed.addFields(...addRows(tracks, 12, true));
    if (queue.repeatMode > 0) embed.setFooter({ text: `🔁 ${loopModes[queue.repeatMode]} Enabled` });

    const reply = { embeds: [embed] };
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