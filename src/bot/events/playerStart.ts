import { GuildQueue, Track } from "discord-player";
import { ColorResolvable, EmbedBuilder, TextBasedChannel, User } from "discord.js";
import { getAverageColor } from "fast-average-color-node";
import { scheduleMessageForDeletion, sendErrorToServerOwner } from "../helpers/handle";
import CommandsClient from "../CommandsClient";

export async function playerStart(track: Track, queue: GuildQueue, client: CommandsClient) {
    // TODO clean up embed building
    const loopModes = ['none', 'Track Loop', 'Queue Loop', 'Autoplay'];

    try {
        const embed = new EmbedBuilder();
        const user = track.requestedBy as User;
        const loop = (queue.repeatMode > 0) ? `${loopModes[queue.repeatMode]} | ` : '';
        
        embed.setTitle(track.title)
            .setURL(track.url)
            .setAuthor({ name: '▶️ Now Playing', iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` })
            .setDescription(track.author)
            .setFooter({ text: `${loop}${track.duration} | ${queue.size} song(s) remaining | ${track.source}` });

        try {
            const songColour = await getAverageColor(track.thumbnail);
            embed.setColor(songColour.hex as ColorResolvable).setThumbnail(track.thumbnail);
        } catch {
            embed.setColor(0xDCD0FF);
        }

        const channel = queue.metadata as TextBasedChannel;
        const message = await channel.send({ embeds: [embed] });
        scheduleMessageForDeletion(message, 2);

    } catch (e) {
        if (e instanceof Error) sendErrorToServerOwner(e, client);
        console.error(e);
    }
};

