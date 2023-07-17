require('dotenv').config();
const glob = require('glob');
const path = require('node:path');

const { REST, Routes } = require('discord.js');

const args = process.argv.slice(2);
const commandsPath = path.join(__dirname, '../commands');
const commands = [];
// Grab all the command files from the commands directory
const commandFiles = glob.sync('**/*.js', { cwd:commandsPath });

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Delete commands
// guild-based commands
rest.put(Routes.applicationGuildCommands(process.env.BOT_ID, process.env.TEST_GUILD_ID), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);
// global commands
rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        // The put method is used to fully refresh all commands in the guild with the current set

        let data;
        // Deploy commands to all guilds
        if (args[0] == 'all') {
            data = await rest.put(
                Routes.applicationCommands(process.env.BOT_ID),
                { body: commands },
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands to ALL GUILDS.`);

        } else {
            // Deploy commands to test guild (default)
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.BOT_ID, process.env.TEST_GUILD_ID),
                { body: commands },
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
		
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();