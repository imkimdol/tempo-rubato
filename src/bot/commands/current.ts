import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { PlayerController } from "../../controller/PlayerController";
import { getAverageColor } from "fast-average-color-node";
import { DatabaseController } from "../../controller/DatabaseController";

const defaultColour = 0xDCD0FF;
const data = new SlashCommandBuilder()
    .setName('current')
    .setDescription('View currently playing song.');
const options: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: false,
    timeoutMultiplier: 2
};
async function callback(interaction: ChatInputCommandInteraction): Promise<MessageContent> {
    const controller = PlayerController.createInstance(interaction);
    const track = controller.getCurrentTrack();

    // TODO clean up embed building
    const queue = controller.getQueue();
    const user = interaction.user;
    const progressBar = queue.node.createProgressBar({
        queue: false,
        separator: ' '
    });
    const guildId = interaction.guildId;
    if (!guildId) throw new Error('guildId does not exist.');
    const dbController = DatabaseController.getInstance();
    const footerText = `${progressBar}\nRequested by ${user.username} | ${dbController.getPlayRate(guildId)}x | ${track.source}`;
    const embed = new EmbedBuilder();
    embed.setTitle(track.title)
        .setURL(track.url)
        .setAuthor({ name: 'Currently Playing' })
        .setDescription(track.author)
        .setFooter({ text: footerText, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` });
    
    try {
        const songColour = await getAverageColor(track.thumbnail);
        const hex = songColour.hex;
        embed.setColor(hex as ColorResolvable).setThumbnail(track.thumbnail);
    } catch {
        embed.setColor(defaultColour);
    }

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