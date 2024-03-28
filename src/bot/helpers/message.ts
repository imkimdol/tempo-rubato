// TODO These are temp functions for bandage implementations. They should be cleaned up when embeds are cleaned up.

import { Track } from "discord-player";

export const trackToInlineField = (track: Track, index: number, numbered: boolean = false) => {
    const num = numbered ? (index+1) + '. ' : ''
    return { name: `${num}${track.title}`, value: `[${track.author}](${track.url})`, inline: true };
};
export const addRows = (tracks: Track[], maxLength: number, numbered: boolean = false) => {
    const items = [];
    for (let i=0; i<0+maxLength; ++i) {
        if (tracks[i]) items.push(trackToInlineField(tracks[i], i, numbered));
    }
    return items;
};