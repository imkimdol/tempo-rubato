require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const glob = require('glob');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();



// Command handler

const commandsPath = path.join(__dirname, '/commands');
const commandFiles = glob.sync('**/*.js', { cwd: commandsPath });

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}



// Event handler

const eventsPath = path.join(__dirname, '/events');
const eventFiles = glob.sync('**/*.js', { cwd: eventsPath });

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}



// Audio player

const { Player } = require("discord-player");

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
client.player.extractors.loadDefault();



// Log in
client.login(process.env.DISCORD_TOKEN);