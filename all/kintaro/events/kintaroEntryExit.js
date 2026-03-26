require('dotenv').config({ path: '../.env' });
const { KINTARO_ENTRY_EXIT, KINTARO_ENTRY_EXIT_WELCOME_CHANNEL } = process.env;

let enableKintaroEntryExit = KINTARO_ENTRY_EXIT === 'true';

module.exports = {
    guildMemberAdd: async function (member) {
        if (!enableKintaroEntryExit) {
            console.log('entry/exit messages are disabled.');
            return;
        }

        try {
            const guild = member.guild;
            const welcomeChannel = guild.channels.cache.get(KINTARO_ENTRY_EXIT_WELCOME_CHANNEL);

            if (!welcomeChannel) {
                console.error('Welcome channel is invalid.');
                return;
            }

            const memberCount = guild.memberCount;

            await welcomeChannel.send({
                content: `👋 **${member.user.tag}** sunucuya katıldı! Hoş geldin ${member}! Şu anda sunucuda **${memberCount}** üyeyiz.`
            });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    },

    guildMemberRemove: async function (member) {
        if (!enableKintaroEntryExit) {
            console.log('entry/exit messages are disabled.');
            return;
        }

        try {
            const guild = member.guild;
            const welcomeChannel = guild.channels.cache.get(KINTARO_ENTRY_EXIT_WELCOME_CHANNEL);

            if (!welcomeChannel) {
                console.error('Welcome channel is invalid.');
                return;
            }

            const memberCount = guild.memberCount;

            await welcomeChannel.send({
                content: `**${member}** sunucudan ayrıldı. Şu anda sunucuda **${memberCount}** üyeyiz.`
            });
        } catch (error) {
            console.error('Error sending farewell message:', error);
        }
    }
};