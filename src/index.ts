import DiscordBot from './bot/DiscordBot';
import { PlayerController } from './controller/PlayerController';

const bot = new DiscordBot();
PlayerController.initializePlayer(bot.getClient());