import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { CommandOptionIsNullError, UnreachableCodeReachedError } from "../../errors";
import { DatabaseBanks, DatabaseController } from "../../controller/DatabaseController";
import { bankChoices } from "./register";
import { getAverageColor } from "fast-average-color-node";
import { PlayerController } from "../../controller/PlayerController";
import { addRows } from "../helpers/message";

const searchSubCommandName = 'search';
const nextSubCommandName = 'next';
const favouritesSubCommandName = 'favourites';
const queryOptionName = 'query';
const queryDescription = 'Enter search query.';
const bankOptionName = 'bank';
const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays or queues music.')
    .addSubcommand(subcommand =>
        subcommand
            .setName(searchSubCommandName)
            .setDescription('Play using a search query. Separate by commas for multi-query.')
            .addStringOption(option =>
                option.setName(queryOptionName).setDescription(queryDescription).setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName(nextSubCommandName)
            .setDescription('Play next in queue using a search query. Limited to one song.')
            .addStringOption(option =>
                option.setName(queryOptionName).setDescription(queryDescription).setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName(favouritesSubCommandName)
            .setDescription('Play from your favourites.')
            .addIntegerOption(option =>
                option.setName('bank')
                    .setDescription('Storage bank.')
                    .setRequired(true)
                    .addChoices(...bankChoices)
    )
);
const options: HandleCommandOptions = {
    ephemeral: true,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function searchCallback(interaction: ChatInputCommandInteraction, input: string): Promise<MessageContent> {
    const queries = input.split(/,\s*/);
    const controller = PlayerController.createInstance(interaction);
    const results = await controller.playSearch(queries, interaction);
    
    // TODO clean up embed building
    const embed = new EmbedBuilder();
    const userImage = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`;
    const userColour = await getAverageColor(userImage);
    const queue = controller.getQueue();
    embed.setFooter({ text: `Queue Size: ${queue.size}` });
    embed.setTitle('Added to Queue')
        .setColor(userColour.hex as ColorResolvable);
    
    if (results.length === 0) {
        return 'Found no results!';
    } else if (results.length === 1) {
        const result = results[0];
        embed.addFields({ name: result.track.title, value: result.track.author });
    } else {
        const tracks = results.map(r => r.track);
        embed.addFields(...addRows(tracks, 12));
    }
    
    const reply = { embeds: [embed] };
    return reply;
};
async function nextCallback(interaction: ChatInputCommandInteraction, query: string): Promise<MessageContent> {
    // TODO implement
    
    // const result = results;
    // if (checkNoResult(result)) return editReply(`Found no results!`, interaction, client);
    // embed.setTitle('Added to Front of Queue')
    //     .setColor(userColour.hex)
    //     .setFooter({ text: `Queue Size: ${queue.size}` })
    //     .addFields({ name: result.title, value: result.author });
    
    return 'Not Implemented';
};
async function bankCallback(interaction: ChatInputCommandInteraction, bank: DatabaseBanks): Promise<MessageContent> {
    const controller = DatabaseController.getInstance();
    const userId = interaction.user.id;

    // TODO add guard for no entries in bank
    const query = controller.getBank(userId, bank);

    const reply = await searchCallback(interaction, query);
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const subcommand = interaction.options.getSubcommand();

        let callback: (i: ChatInputCommandInteraction) => Promise<MessageContent>;
        switch (subcommand) {
            case searchSubCommandName:
                const querySearch = interaction.options.getString(queryOptionName);
                if (!querySearch) throw new CommandOptionIsNullError(queryOptionName);
                callback = i => searchCallback(i, querySearch);

                break;
            case nextSubCommandName:
                const queryNext = interaction.options.getString(queryOptionName);
                if (!queryNext) throw new CommandOptionIsNullError(queryOptionName);
                callback = i => nextCallback(i, queryNext);

                break;
            case favouritesSubCommandName:
                const bank = interaction.options.getNumber(bankOptionName);
                if (!bank) throw new CommandOptionIsNullError(bankOptionName);
                if (!(bank in DatabaseBanks)) throw new UnreachableCodeReachedError('Bank index is out of expected range (0-4).');
                callback = i => bankCallback(i, bank);

                break;
            default:
                throw new UnreachableCodeReachedError('No valid subcommand was selected.');
        }

        try {
            handleCommand(interaction, callback, options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};