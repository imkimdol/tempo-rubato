import { DatabaseOptions, Level } from "level";

export enum DatabaseBanks { Bank1, Bank2, Bank3, Bank4, Bank5 }

// Singleton
export class DatabaseController {
    private readonly location = 'levelDB';
    private readonly options: DatabaseOptions<string, string> = { keyEncoding: 'json' };

    private static instance: DatabaseController;
    private database: Level;

    private constructor() {
        this.database = new Level(this.location, this.options);
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