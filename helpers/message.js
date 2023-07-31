
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

module.exports = {editReply};