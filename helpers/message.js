
const editReply = async (content, interaction, client, timeoutMultiplier) => {
    const message = await interaction.editReply(content);

    if (!timeoutMultiplier) timeoutMultiplier = 1;
    if (client.timeout > 0) {
        setTimeout(() => {
            try {
                message.delete();
            } catch (err) {
                // do nothing
            }
        }, client.timeout * timeoutMultiplier);
    }
};

const handleError = (err, interaction, client) => {
    console.error(err);
    client.users.send(interaction.user.id, '```javascript\n' + err.stack + '```');
    interaction.editReply(process.env.ERROR_MESSAGE);
};

module.exports = { editReply, handleError};