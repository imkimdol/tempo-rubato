import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsClient from "../CommandsClient";
import { HandleCommandOptions, MessageContent, handleCommand, handleError } from "../helpers/handle";
import { CommandOptionIsNullError, UnreachableCodeReachedError } from "../../errors";
import { DatabaseBanks, DatabaseController } from "../../controller/DatabaseController";

const bankOptionName = 'bank';
const queryOptionName = 'query';
export const bankChoices = [
    { name: 'Bank 1', value: 0 },
    { name: 'Bank 2', value: 1 },
    { name: 'Bank 3', value: 2 },
    { name: 'Bank 4', value: 3 },
    { name: 'Bank 5', value: 4 }
];
const data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers a search query to your favourites.')
    .addIntegerOption(option =>
        option.setName(bankOptionName)
            .setDescription('Storage bank to register at.')
            .setRequired(true)
            .addChoices(...bankChoices)
    )
    .addStringOption(option =>
        option.setName(queryOptionName).setDescription('Search query to register.').setRequired(true)
    );
const options: HandleCommandOptions = {
    ephemeral: true,
    checkInVoice: true,
    timeoutMultiplier: 1
};
async function callback(interaction: ChatInputCommandInteraction, bank: DatabaseBanks, query: string): Promise<MessageContent> {
    const controller = DatabaseController.getInstance();
    const userId = interaction.user.id;
    controller.setBank(query, userId, bank);

    const reply = `Added search query to bank ${bank}.`;
    return reply;
};

module.exports = {
    data: data,
    async execute(interaction: ChatInputCommandInteraction, client: CommandsClient) {
        const bank = interaction.options.getNumber(bankOptionName);
        const query = interaction.options.getString(queryOptionName);
        if (!bank) throw new CommandOptionIsNullError(bankOptionName);
        if (!query) throw new CommandOptionIsNullError(queryOptionName);
        if (!(bank in DatabaseBanks)) throw new UnreachableCodeReachedError('Bank index is out of expected range (0-4).');

        try {
            handleCommand(interaction, i => callback(i, bank, query), options);
        } catch (e) {
            if (e instanceof Error) handleError(e, interaction, client);
        }
    }
};