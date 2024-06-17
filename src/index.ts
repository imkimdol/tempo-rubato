import DiscordBot from './bot/DiscordBot';
import { PlayerController } from './controller/PlayerController';

const bot = new DiscordBot();

const args = process.argv.slice(2);
const verbose = args.includes('v') || args.includes('verbose');
PlayerController.initializePlayer(bot.getClient(), verbose);
console.log(PlayerController.getDependenciesSummary());