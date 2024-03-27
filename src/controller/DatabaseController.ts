import { Level } from "level";

export enum DatabaseBanks { Bank1, Bank2, Bank3, Bank4, Bank5 }

// Singleton
export class DatabaseController {
    private static instance: DatabaseController;
    private database: Level;

    private constructor() {
        throw new Error('Not Implemented.');
    }

    static getInstance(): DatabaseController {
        throw new Error('Not Implemented.');
    };

    setBank(query: string, userId: string, bank: DatabaseBanks) {
        
    }

    getBank(userId: string, bank: DatabaseBanks): string {
        throw new Error('Not Implemented.');
    }

    setSpeed(speed: number, guildId: string) {
        
    }
}