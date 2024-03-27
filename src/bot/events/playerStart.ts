import { Track } from "discord-player";
import { TextBasedChannel } from "discord.js";

export function playerStart(track: Track, channel: TextBasedChannel) {

};

// try {
//     const embed = new EmbedBuilder();
//     const user = track.requestedBy;
//     const loop = (queue.repeatMode > 0) ? `${loopModes[queue.repeatMode]} | ` : '';
    
//     embed.setTitle(track.title)
//         .setURL(track.url)
//         .setAuthor({ name: '▶️ Now Playing', iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` })
//         .setDescription(track.author)
//         .setFooter({ text: `${loop}${track.duration} | ${queue.size} song(s) remaining | ${track.source}` });

//     try {
//         const songColour = await getAverageColor(track.thumbnail);
//         embed.setColor(songColour.hex).setThumbnail(track.thumbnail);
//     } catch {
//         embed.setColor(0xDCD0FF);
//     }

//     const message = await queue.metadata.send({ embeds: [embed] });
//     if (client.timeout > 0) {
//         setTimeout(() => {
//             try {
//                 message.delete();
//             } catch (err) {
//                 // do nothing
//             }
//         }, client.timeout * 2);
//     }
// } catch (err) {
//     console.error(err);
//     client.users.send(process.env.OWNER_ID, '```javascript\n' + err.stack + '```');
// }