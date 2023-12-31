const args = process.argv.slice(2);

require('dotenv').config();

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const glob = require('glob');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();
client.timeout = parseInt(process.env.MESSAGE_TIMEOUT);
client.playRates = {};



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



// Level DB

const { Level } = require('level');
const db = new Level('db', { keyEncoding: 'json' });
client.db = db;



// Audio player

const { Player } = require("discord-player");
const { getAverageColor } = require('fast-average-color-node');

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

if (args[0] === 'v' || args[0] === 'verbose') {
    player.on('debug', async (message) => {
        // Emitted when the player sends debug info
        // Useful for seeing what dependencies, extractors, etc are loaded
        console.log(`General player debug event: ${message}`);
    });
    
    player.events.on('debug', async (queue, message) => {
        // Emitted when the player queue sends debug info
        // Useful for seeing what state the current queue is at
        console.log(`Player debug event: ${message}`);
    });
    
    player.events.on('error', (queue, error) => {
        // Emitted when the player queue encounters error
        console.log(`General player error event: ${error.message}`);
        console.log(error);
    });
    
    player.events.on('playerError', (queue, error) => {
        // Emitted when the audio player errors while streaming audio track
        console.log(`Player error event: ${error.message}`);
        console.log(error);
    });
}

const awaitExtractors = async () => {
    await player.extractors.loadDefault();
    console.log(player.scanDeps());
};
awaitExtractors();

const loopModes = ['none', 'Track Loop', 'Queue Loop', 'autoplay'];
player.events.on('playerStart', async (queue, track) => {
    try {
        const embed = new EmbedBuilder();
        const user = track.requestedBy;
        const loop = (queue.repeatMode > 0) ? `${loopModes[queue.repeatMode]} | ` : '';
        
        embed.setTitle(track.title)
            .setURL(track.url)
            .setAuthor({ name: '▶️ Now Playing', iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` })
            .setDescription(track.author)
            .setFooter({ text: `${loop}${track.duration} | ${queue.size} song(s) remaining | ${track.source}` });

        try {
            const songColour = await getAverageColor(track.thumbnail);
            embed.setColor(songColour.hex).setThumbnail(track.thumbnail);
        } catch {
            embed.setColor(0xDCD0FF);
        }

        const message = await queue.metadata.send({ embeds: [embed] });
        if (client.timeout > 0) {
            setTimeout(() => {
                try {
                    message.delete();
                } catch (err) {
                    // do nothing
                }
            }, client.timeout * 2);
        }
    } catch (err) {
        console.error(err);
        client.users.send(process.env.OWNER_ID, '```javascript\n' + err.stack + '```');
    }
});

player.events.on('queueCreate', queue => {
    const playRate = client.playRates[queue.guild.id];
    if (playRate !== 1) {
        queue.filters.ffmpeg.setInputArgs(['-af', `aresample=48000,asetrate=48000*${playRate}`]);
        queue.filters.ffmpeg.setFilters([]);
    }
});



// Log in
client.login(process.env.DISCORD_TOKEN);