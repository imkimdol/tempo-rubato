export class PlayerNotInitializedError extends Error {
    constructor() {
        const message = 'Player is not initialized. Please call initializePlayer before proceeding.';
        super(message);
        this.name = "PlayerNotInitializedError";
        Object.setPrototypeOf(this, PlayerNotInitializedError.prototype);
    }
} 

export class NoQueueError extends Error {
    constructor() {
        const message = 'Bot is currently not playing in this channel.';
        super(message);
        this.name = "NoQueueError";
        Object.setPrototypeOf(this, NoQueueError.prototype);
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

export class RemovalAmountOutOfRangeError extends Error {
    constructor() {
        const message = 'Amount to remove is too large.';
        super(message);
        this.name = "RemovalAmountOutOfRangeError";
        Object.setPrototypeOf(this, RemovalAmountOutOfRangeError.prototype);
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

export class IsNotIntegerError extends Error {
    constructor() {
        const message = 'Given number is not an integer.';
        super(message);
        this.name = "NotIntegerError";
        Object.setPrototypeOf(this, IsNotIntegerError.prototype);
    }
}

export class UnreachableCodeReachedError extends Error {
    constructor(message: string) {
        super(message + ' This code should be unreachable.');
        this.name = "UnreachableCodeReachedError";
        Object.setPrototypeOf(this, UnreachableCodeReachedError.prototype);
    }
}

export class CommandOptionIsNullError extends UnreachableCodeReachedError {
    constructor(optionName: string) {
        const message = `Command option ${optionName} is null.`;
        super(message);
        this.name = "CommandOptionIsNullError";
        Object.setPrototypeOf(this, CommandOptionIsNullError.prototype);
    }
}