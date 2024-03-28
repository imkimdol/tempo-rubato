// TODO These are temp functions and values for bandage implementations. They should be cleaned up when embeds are cleaned up.

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

export const bankChoices = [
    { name: 'Bank 1', value: 0 },
    { name: 'Bank 2', value: 1 },
    { name: 'Bank 3', value: 2 },
    { name: 'Bank 4', value: 3 },
    { name: 'Bank 5', value: 4 }
];