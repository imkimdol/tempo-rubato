import { ChatInputCommandInteraction, MessagePayload, Message, GuildMember, TextBasedChannel, ChannelType, EmbedBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { IsNotIntegerError, NoHistoryError, NoQueueError, RateOutOfRangeError, RemovalAmountOutOfRangeError } from "../../errors";

export type HandleCallback = (interaction: ChatInputCommandInteraction) => Promise<MessageContent>;
export type MessageContent = string | { embeds: EmbedBuilder[] };
export interface HandleCommandOptions {
    ephemeral: boolean,
    checkInVoice: boolean;
    timeoutMultiplier: number;
}

const defaultOptions: HandleCommandOptions = {
    ephemeral: false,
    checkInVoice: true,
    timeoutMultiplier: 1
};
const errorTimeoutMultiplier = 2;
const playerControllerErrorTimeoutMultiplier = 1;
const defaultTimeout = 10000;
const userNotInVoiceMessage = 'You need to be in a Voice Channel.';
const unsupportedChanneTypeMessage = 'This command is not supported in this channel.';

export async function handleCommand(interaction: ChatInputCommandInteraction, callback: HandleCallback, options: HandleCommandOptions = defaultOptions) {
    await interaction.deferReply({ ephemeral: options.ephemeral });

    // TODO check for nulls (member and channel)
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as TextBasedChannel;
    if (options.checkInVoice && !member.voice.channel) {
        return editReply(userNotInVoiceMessage, interaction, options.timeoutMultiplier);
    } else if (channel.type === null || channel.type !== ChannelType.GuildText) {
        return editReply(unsupportedChanneTypeMessage, interaction, options.timeoutMultiplier);
    }
    
    try {
        const content = await callback(interaction);
        await editReply(content, interaction, options.timeoutMultiplier);
    } catch (e) {
        const nqe = e instanceof NoQueueError;
        const nhe = e instanceof NoHistoryError;
        const rmoore = e instanceof RemovalAmountOutOfRangeError;
        const roore = e instanceof RateOutOfRangeError;
        const inie = e instanceof IsNotIntegerError;

        if (nqe || nhe || rmoore || roore || inie) {
            return editReply(e.message, interaction, playerControllerErrorTimeoutMultiplier);
        }
        throw e;
    }
};
export function handleError(error: Error, interaction: ChatInputCommandInteraction, client: CommandsClient) {
    console.error(error);

    try {
        sendErrorToServerOwner(error, client);
        const messageToSender = process.env.ERROR_MESSAGE;
        if (messageToSender) editReply(messageToSender, interaction, errorTimeoutMultiplier);
    } catch (e) {
        // Do nothing. Reporting the error went wrong, so trying again will probably not work.
        console.error(e);
    }
};
export function sendErrorToServerOwner(error: Error, client: CommandsClient) {
    const owner = process.env.OWNER_ID;
    const stackMessage = '```javascript\n' + error.stack + '```';
    if (owner) client.users.send(owner, stackMessage);
}
export function scheduleMessageForDeletion(message: Message, timeoutMultiplier: number) {
    let timeout = defaultTimeout;
    try {
        const envTimeout = process.env.MESSAGE_TIMEOUT;
        if (envTimeout) timeout = parseInt(envTimeout);
    } catch {
        throw new Error('Error parsing message timeout duration.');
    }

    if (timeout > 0) {
        setTimeout(() => {
            try {
                message.delete();
            } catch (e) {
                // Do nothing. Message or channel may have been removed.
            }
        }, timeout * timeoutMultiplier);
    }
};
async function editReply(content: MessageContent, interaction: ChatInputCommandInteraction, timeoutMultiplier: number) {
    const message = await interaction.editReply(content);
    scheduleMessageForDeletion(message, timeoutMultiplier);
};