import { DatabaseOptions, Level } from "level";

export enum DatabaseBanks { Bank1, Bank2, Bank3, Bank4, Bank5 }

// Singleton
export class DatabaseController {
    private static readonly location = 'levelDB';
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

    setBank(query: string, userId: string, bank: DatabaseBanks) {
        
    }

    getBank(userId: string, bank: DatabaseBanks): string {
        throw new Error('Not Implemented.');
    }

    setSpeed(speed: number, guildId: string) {
        
    }
}