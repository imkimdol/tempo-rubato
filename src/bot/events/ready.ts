import { ClientUser, Events, ClientPresenceStatus } from 'discord.js';
import CommandsClient from './../CommandsClient';
import cron from 'node-cron';

const isClientPresenceStatus = (status: string): status is ClientPresenceStatus => {
    return ['online', 'idle', 'dnd'].includes(status);
  }

const setStatus = (user: ClientUser) => {
    const status = process.env.STATUS;
    if (status) {
        const statusIsValid = isClientPresenceStatus(status);
        if (statusIsValid) user.setStatus(status);
    }
    if (process.env.ACTIVITY_TYPE && process.env.ACTIVITY_MESSAGE) user.setActivity(process.env.ACTIVITY_MESSAGE, { type: parseInt(process.env.ACTIVITY_TYPE) });
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: CommandsClient) {
        const user = client.user as ClientUser;
        console.log(`Ready! Logged in as ${user.tag}`);

        cron.schedule('0 * * * *', () => setStatus(user));
        setStatus(user);
    },
};