const { Events } = require('discord.js');
const cron = require('node-cron');

const setStatus = (client) => {
    if (process.env.STATUS) client.user.setStatus(process.env.STATUS);
    if (process.env.ACTIVITY_TYPE && process.env.ACTIVITY_MESSAGE) client.user.setActivity(process.env.ACTIVITY_MESSAGE, { type: parseInt(process.env.ACTIVITY_TYPE) });
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        cron.schedule('0 * * * *', () => setStatus(client));
        setStatus(client);
    },
};