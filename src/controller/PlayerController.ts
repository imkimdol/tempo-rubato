import { GuildQueue, GuildQueueHistory, Player, QueueRepeatMode, Track } from "discord-player";

export class PlayerController {
    private static playerInstance: Player;

    constructor(guildId: string) {

    };
    static initializePlayer() {

    }

    // Info
    getCurrentTrack(): Track<unknown> {
        throw new Error('Not Implemented.');
    };
    getQueue(): GuildQueue<unknown> {
        throw new Error('Not Implemented.');
    };
    getHistory(): GuildQueueHistory<unknown> {
        throw new Error('Not Implemented.');
    };

    // Queue Management
    playSearch(query: string[]): Track<unknown>[] {
        throw new Error('Not Implemented.');
    };

    playNext(query: string): Track<unknown> {
        throw new Error('Not Implemented.');
    };
    removeLast(): Track<unknown> {
        throw new Error('Not Implemented.');
    };
    clear() {

    };
    shuffle() {

    };
    setRepeatMode(mode: QueueRepeatMode) {

    };

    // Playback
    pause(): boolean {
        throw new Error('Not Implemented.');
    };
    previous() {

    };
    skip(): Track<unknown> {
        throw new Error('Not Implemented.');
    };
    seek() {

    };
    speed() {

    };
    stop() {

    };
}