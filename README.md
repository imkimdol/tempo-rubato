# Tempo Rubato

A Discord bot for playing music with user-defined speeds. Built with [Discord Player](https://discord-player.js.org/).

## Installation
1. Clone the repository.
2. Create a Discord application from the [Discord Developer Portal](https://discord.com/developers).
3. Create a `.env` file with the following parameters:
    - `DISCORD_TOKEN`: Your Discord bot token
    - `ERROR_MESSAGE`: Message that will display when there is an error
    - `TEST_GUILD_ID`: The development Discord server. `yarn run deploy` will deploy commands only to this server.
    - `BOT_ID`: Your Discord bot's ID. Used for deploying/registering commands.
    - `OWNER_ID`: The owner's ID. Gives the owner access to the `/echo` command.
    - `STATUS`: The status the bot will display. Refer [here](https://old.discordjs.dev/#/docs/discord.js/14.11.0/typedef/PresenceStatusData) for all the status options.
    - `ACTIVITY_TYPE`: The activity the bot will display. Refer [here](https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType) for all the activity types.
    - `ACTIVITY_MESSAGE`: The message the bot's activity will display.
    - `MESSAGE_TIMEOUT`: Amount of milliseconds before the bot removes its own messages. Enter `-1` to disable.
4. In the repository's directory, run `yarn install`. This installs all the required Node.js dependencies.
5. Type `yarn run deploy all`. This registers all the commands to all guilds.
6. Finally, type `yarn run start` to start the bot.
