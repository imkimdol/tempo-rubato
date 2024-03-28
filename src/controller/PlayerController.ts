import { GuildQueue, GuildQueueHistory, GuildQueuePlayerNode, Player, PlayerInitOptions, PlayerNodeInitializationResult, PlayerNodeInitializerOptions, QueueRepeatMode, Track, useHistory, useQueue } from "discord-player";
import CommandsClient from "../bot/CommandsClient";
import { IsNotIntegerError, NoHistoryError, NoQueueError, PlayerNotInitializedError, RemovalAmountOutOfRangeError, ValueNotFoundError } from "../errors";
import { playerStart } from "../bot/events/playerStart";
import { ChatInputCommandInteraction, CommandInteraction, GuildMember, GuildVoiceChannelResolvable, VoiceBasedChannel } from "discord.js";
import { DatabaseController } from "./DatabaseController";

export class PlayerController {
    private static readonly playerOptions: PlayerInitOptions = {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1 << 25
        }
    };
    private static getPlayerNodeOptions(interaction: CommandInteraction): PlayerNodeInitializerOptions<any> {
        return {
            requestedBy: interaction.user,
            connectionOptions: {
                deaf: false,
            },
            nodeOptions: {
                metadata: interaction.channel,
                bufferingTimeout: 10000
            }
        }
    }

    private static player: Player;
    private guildId: string;

    constructor(guildId: string) {
        PlayerController.checkPlayerInitialized();
        this.guildId = guildId;
    };
    static createInstance(interaction: ChatInputCommandInteraction) {
        const guildId = interaction.guildId;
        if (!guildId) throw new Error('guildId does not exist.');

        return new PlayerController(guildId);
    }

    static async initializePlayer(client: CommandsClient, verbose: boolean = false) {
        this.player = new Player(client, this.playerOptions);
        await this.player.extractors.loadDefault();
        this.attachEventListeners(client);
        if (verbose) this.attachDebugListeners();
    };
    private static checkPlayerInitialized() {
        if (this.player === undefined) throw new PlayerNotInitializedError();
    }
    private static attachEventListeners(client: CommandsClient) {
        this.checkPlayerInitialized();

        this.player.events.on('playerStart', async (queue, track) => {
            playerStart(track, queue, client);
        });
        this.player.events.on('queueCreate', PlayerController.setFFmpegSampleRate);
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
    getQueue(): GuildQueue<unknown> {
        const queue = useQueue(this.guildId);
        if (!queue) throw new NoQueueError();
        return queue;
    };
    private getPlayerNode(): GuildQueuePlayerNode<unknown> {
        return this.getQueue().node;
    }
    getTracks() {
        return this.getQueue().tracks;
    };
    getCurrentTrack(): Track<unknown> {
        // TODO add guard for null
        return this.getQueue().currentTrack as Track<unknown>;
    };
    getHistory(): GuildQueueHistory<unknown> {
        const history = useHistory(this.guildId);
        if (!history) throw new NoHistoryError();
        return history;
    };

    // Queue Management
    private async play(query: string, channel: GuildVoiceChannelResolvable, options: PlayerNodeInitializerOptions<any>): Promise<PlayerNodeInitializationResult<any> | null>{
        try {
            return await PlayerController.player.play(channel, query, options);
        } catch (err) {
            if (err instanceof Error && err.name === 'ERR_NO_RESULT') return null;
            throw err;
        }
    };
    async playSearch(queries: string[], interaction: ChatInputCommandInteraction): Promise<PlayerNodeInitializationResult<any>[]> {
        const results = []

        // TODO check for nulls (member and channel)
        const member = interaction.member as GuildMember;
        const channel = member.voice.channel as VoiceBasedChannel;
        const options = PlayerController.getPlayerNodeOptions(interaction);

        for (const query of queries) {
            const result = await this.play(query, channel, options);
            if (result) results.push(result);
        };

        return results;
    };
    playNext(query: string, interaction: ChatInputCommandInteraction): Track<unknown> {
        // TODO implement
        throw new Error('Not Implemented.');
    };
    removeLast(amount: number): Track<unknown>[] {
        if (!Number.isInteger(amount)) throw new IsNotIntegerError();

        const queue = this.getQueue();
        const queueSize = queue.size;
        if (queueSize < amount || amount < 1) {
            throw new RemovalAmountOutOfRangeError();
        }

        const tracks = this.getTracks().toArray()
        const tracksToRemove = tracks.slice(queueSize-amount, amount);
        for (const track of tracksToRemove) {
            queue.removeTrack(track);
        }

        return tracksToRemove;
    };
    clear() {
        const queue = this.getQueue();
        queue.clear();
    };
    shuffle() {
        const tracks = this.getTracks();
        tracks.shuffle();
    };
    setRepeatMode(mode: QueueRepeatMode) {
        const queue = this.getQueue();
        queue.setRepeatMode(mode);
    };

    // Playback
    static setFFmpegSampleRate(queue: GuildQueue) {
        let rate;
        try {
            const dbController = DatabaseController.getInstance();
            rate = dbController.getPlayRate(queue.guild.id);
        } catch (e) {
            if (e instanceof ValueNotFoundError) rate = 1;
            throw e;
        }
        queue.filters.ffmpeg.setInputArgs(['-af', `aresample=44100,asetrate=44100*${rate}`]);
        queue.filters.ffmpeg.setFilters([]);
    };
    pause(): boolean {
        const node = this.getPlayerNode();
        return node.pause();
    };
    async previous(): Promise<Track<unknown>> {
        const track = this.getCurrentTrack();
        const history = this.getHistory();

        // TODO add guard for no tracks in history
        // try {
        //     await history.previous();
        // } catch (err) {
        //     if (err.name === 'ERR_NO_RESULT') return editReply('There is no history.', interaction, client)
        //     throw err;
        // }

        await history.previous();
        return track;
    };
    skip(): Track<unknown> {
        const node = this.getPlayerNode();
        const track = this.getCurrentTrack();
        node.skip();
        return track;
    };
    async seek(location: number) {
        // TODO add guards for seek location (if needed)
        // if (location * 1000 >= queue.currentTrack.durationMS) {
        //     await queue.node.seek(queue.currentTrack.durationMS);
        // } else {
        //     await queue.node.seek(location * 1000);
        // }
        
        const node = this.getPlayerNode();
        await node.seek(location);
    };
    playbackSpeed(rate: number) {
        // TODO implement
        // if (rate < 0.5 || rate > 2.0) {
        //     return interaction.editReply('Playback rate is too extreme.');
        // }

        // const queue = useQueue(interaction.guild.id);
        // client.playRates[interaction.guild.id] = rate;
        // if (queue) {      
        //     queue.filters.ffmpeg.setInputArgs(['-af', `aresample=48000,asetrate=48000*${rate}`]);
        //     queue.filters.ffmpeg.setFilters([]);
        // }
        throw new Error('Not Implemented.');
    };
    stop() {
        const queue = this.getQueue();
        queue.delete();
    };
}