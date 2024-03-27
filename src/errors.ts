export class UnsupportedChannelTypeError extends Error {
    constructor() {
        const message = 'This command is not supported in this channel.';
        super(message);
        this.name = "UnsupportedChannelTypeError";
        Object.setPrototypeOf(this, UnsupportedChannelTypeError.prototype);
    }
} 

export class UserNotInVoiceError extends Error {
    constructor() {
        const message = 'You need to be in a Voice Channel.';
        super(message);
        this.name = "UserNotInVoiceError";
        Object.setPrototypeOf(this, UserNotInVoiceError.prototype);
    }
} 

export class NotPlayingError extends Error {
    constructor() {
        const message = 'Bot is currently not playing in this channel.';
        super(message);
        this.name = "NotPlayingError";
        Object.setPrototypeOf(this, NotPlayingError.prototype);
    }
} 

export class NoHistoryError extends Error {
    constructor() {
        const message = 'There is no playback history.';
        super(message);
        this.name = "NoHistoryError";
        Object.setPrototypeOf(this, NoHistoryError.prototype);
    }
} 

export class RateOutOfRangeError extends Error {
    constructor() {
        const message = 'Playback rate is too extreme.';
        super(message);
        this.name = "RateOutOfRangeError";
        Object.setPrototypeOf(this, RateOutOfRangeError.prototype);
    }
} 
