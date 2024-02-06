
const editReply = async (content, interaction, client, timeoutMultiplier) => {
    const message = await interaction.editReply(content);

    if (!timeoutMultiplier) timeoutMultiplier = 1;
    if (client.timeout > 0) {
        setTimeout(() => {
            try {
                message.delete();
            } catch (err) {
                client.users.send(process.env.OWNER_ID, 'Error deleting message.\n' + err.stack );
            }
        }, client.timeout * timeoutMultiplier);
    }
};

const handleError = (err, interaction, client) => {
    console.error(err);
    client.users.send(process.env.OWNER_ID, '```javascript\n' + err.stack + '```');
    editReply(process.env.ERROR_MESSAGE, interaction, client);
};

const trackToInlineField = (track, index, numbered) => {
    const num = numbered ? (index+1) + '. ' : ''
    return { name: `${num}${track.title}`, value: `[${track.author}](${track.url})`, inline: true };
};
const addRows = (tracks, maxLength, numbered) => {
    const items = [];
    for (i=0; i<0+maxLength; ++i) {
        if (tracks[i]) items.push(trackToInlineField(tracks[i], i, numbered));
    }
    return items;
}

module.exports = { editReply, handleError, addRows };