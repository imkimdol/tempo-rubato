require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const glob = require('glob');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();
client.timeout = parseInt(process.env.MESSAGE_TIMEOUT);
client.playRate = 1.0;



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

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
player.extractors.loadDefault();

player.events.on('playerStart', async (queue, track) => {
    const message = await queue.metadata.send(`Playing: ${track.title}`);
    if (client.timeout > 0) setTimeout(() => message.delete(), client.timeout);
});
player.events.on('queueCreate', queue => {
    const playRate = client.playRate;
    if (playRate !== 1) {
        queue.filters.ffmpeg.setInputArgs(['-af', `aresample=48000,asetrate=48000*${client.playRate}`]);
        queue.filters.ffmpeg.setFilters([]);
    }
});


// Log in
client.login(process.env.DISCORD_TOKEN);