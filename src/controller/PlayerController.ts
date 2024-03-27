import { GuildQueue, GuildQueueHistory, Player, PlayerInitOptions, QueueRepeatMode, Track } from "discord-player";
import CommandsClient from "../bot/CommandsClient";
import { PlayerNotInitializedError } from "../errors";
import { playerStart } from "../bot/events/playerStart";

export class PlayerController {
    private static readonly playerInitOptions: PlayerInitOptions = {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1 << 25
        }
    };
    private static player: Player;

    constructor(guildId: string) {
        PlayerController.checkPlayerInitialized();
    };

    static async initializePlayer(client: CommandsClient, verbose: boolean = false) {
        this.player = new Player(client, this.playerInitOptions);
        await this.player.extractors.loadDefault();
        this.attachEventListeners();
        if (verbose) this.attachDebugListeners();
    };
    private static checkPlayerInitialized() {
        if (this.player === undefined) throw new PlayerNotInitializedError();
    }
    private static attachEventListeners() {
        this.checkPlayerInitialized();

        this.player.events.on('playerStart', async (queue, track) => {
            playerStart(track, queue.metadata.channel);
        });
        this.player.events.on('queueCreate', queue => {
            // const playRate = playRates[queue.guild.id];
            // if (playRate !== 1) {
            //     queue.filters.ffmpeg.setInputArgs(['-af', `aresample=48000,asetrate=48000*${playRate}`]);
            //     queue.filters.ffmpeg.setFilters([]);
            // }
        });
    }
    private static attachDebugListeners() {
        this.checkPlayerInitialized();

        this.player.on('debug', async (message) => {
            // Emitted when the player sends debug info
            // Useful for seeing what dependencies, extractors, etc are loaded
            console.log(`General player debug event: ${message}`);
        });
        this.player.events.on('debug', async (queue, message) => {
            // Emitted when the player queue sends debug info
            // Useful for seeing what state the current queue is at
            console.log(`Player debug event: ${message}`);
        });
        this.player.events.on('error', (queue, error) => {
            // Emitted when the player queue encounters error
            console.log(`General player error event: ${error.message}`);
            console.log(error);
        });
        this.player.events.on('playerError', (queue, error) => {
            // Emitted when the audio player errors while streaming audio track
            console.log(`Player error event: ${error.message}`);
            console.log(error);
        });
    };
    static getDependenciesSummary(): string {
        this.checkPlayerInitialized();
        return this.player.scanDeps();
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