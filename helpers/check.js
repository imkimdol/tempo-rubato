const { ChannelType } = require('discord.js');

const { useQueue, useHistory } = require('discord-player');
const { editReply } = require('./message');

const checkChannelType = (interaction, client) => {
    if ( interaction.channel.type === null ) {
        editReply('This command is not supported in this channel.', interaction, client);
        return false;
    } else if ( interaction.channel.type !== ChannelType.GuildText ) {c
        editReply('This command is not supported in this channel.', interaction, client);
        return false;
    }
    return true;
}

const checkInVoice = (interaction, client) => {
    if (!interaction.member.voice.channel) {
        editReply('You need to be in a Voice Channel.', interaction, client);
        return false;
    }
    return true;
};

const checkPlaying = (interaction, client) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
        editReply('Bot is currently not playing.', interaction, client);
        return false;
    }
    return true;
};

const checkHistory = (interaction, client) => {
    const history = useHistory(interaction.guild.id);
    if (!history) {
        editReply('There is no playback history.', interaction, client);
        return false
    }
    return true;
}

module.exports = { checkChannelType, checkInVoice, checkPlaying, checkHistory };