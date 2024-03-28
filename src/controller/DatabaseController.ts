import { DatabaseOptions, Level } from "level";
import { InvalidValueError, ValueNotFoundError } from "../errors";

export enum DatabaseBanks { Bank1, Bank2, Bank3, Bank4, Bank5 }
enum DataTypes { Bank, PlayRate }

// Singleton
export class DatabaseController {
    private static readonly location = 'db';
    private static readonly options: DatabaseOptions<string, string> = { keyEncoding: 'json' };

    private static instance: DatabaseController;
    private database: Level;

    private constructor() {
        this.database = new Level(DatabaseController.location, DatabaseController.options);
    }
    static getInstance(): DatabaseController {
        if (!this.instance) this.instance = new DatabaseController();
        return this.instance;
    };

    private getKey(type: DataTypes, id: string): string {
        return DataTypes[type] + '-' + id.toString();
    }
    private getBankId(userId: string, bank: DatabaseBanks) {
        return userId + '-' + bank;
    }
    async setBank(query: string, userId: string, bank: DatabaseBanks) {
        const key = this.getKey(DataTypes.Bank, this.getBankId(userId, bank));
        await this.database.put(key, query);
    }
    async getBank(userId: string, bank: DatabaseBanks): Promise<string> {
        const key = this.getKey(DataTypes.Bank, this.getBankId(userId, bank));
        try {
            const query = await this.database.get(key);
            return query;
        } catch (e) {
            if (e instanceof Error && e.message === 'LEVEL_NOT_FOUND') throw new ValueNotFoundError();
            throw e;
        }
    }
    async setPlayRate(rate: number, guildId: string) {
        const key = this.getKey(DataTypes.Bank, guildId);
        await this.database.put(key, rate.toString());
    }
    async getPlayRate(guildId: string): Promise<number> {
        const key = this.getKey(DataTypes.Bank, guildId);
        try {
            const value = await this.database.get(key);
            const rate = Number.parseFloat(value);
            if (!Number.isFinite(rate)) throw new InvalidValueError(`Rate value ${rate} retrieved from database with key ${key} is invalid.`);
            return rate;
        } catch (e) {
            if (e instanceof Error && e.message.includes('NotFound')) throw new ValueNotFoundError();
            throw e;
        }
    }
}