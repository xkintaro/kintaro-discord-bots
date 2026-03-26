const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
require('dotenv').config();

const { KINTARO_JUMP_VOICE_AUTO, KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL, KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID } = process.env;
const interval = parseInt(KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL, 10) * 1000;

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        if (KINTARO_JUMP_VOICE_AUTO !== 'true') return;

        setInterval(() => {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const voiceChannel = guild.channels.cache.get(KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID);
            if (!voiceChannel) return;

            const connection = getVoiceConnection(guild.id);
            if (connection && connection.joinConfig.channelId === voiceChannel.id) {
                console.log(`Bot is already in ${voiceChannel.name} channel!`);
                return;
            }

            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });

            console.log(`Bot joined ${voiceChannel.name} voice channel!`);
        }, interval);
    },
};