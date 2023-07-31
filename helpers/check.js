const { useQueue, useHistory } = require('discord-player');
const { editReply } = require('./message');

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

module.exports = { checkInVoice, checkPlaying, checkHistory };