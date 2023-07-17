const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        if (process.env.STATUS) client.user.setStatus(process.env.STATUS);
        if (process.env.ACTIVITY_TYPE && process.env.ACTIVITY_MESSAGE) client.user.setActivity(process.env.ACTIVITY_MESSAGE, { type: parseInt(process.env.ACTIVITY_TYPE) });
    },
};