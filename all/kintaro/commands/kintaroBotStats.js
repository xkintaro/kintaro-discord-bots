const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const botCreator = '<@753989089228750879>';
const botBio = 'KintaroBot - Her zaman hizmetinizde!';
const startTime = Date.now();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstats')
        .setDescription('Bot hakkında bilgi verir'),
    async execute(interaction) {
        const uptime = Date.now() - startTime;
        const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const uptimeSeconds = Math.floor((uptime % (1000 * 60)) / 1000);

        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const embed = new EmbedBuilder()
            .setTitle('🤖 KintaroBot İstatistikleri')
            .setDescription('Bot hakkında detaylı bilgi aşağıdadır:')
            .addFields(
                { name: '⏳ Çalışma Süresi', value: `${uptimeHours} saat, ${uptimeMinutes} dakika, ${uptimeSeconds} saniye`, inline: false },
                { name: '👨‍💻 Yapımcı', value: botCreator, inline: false },
                { name: ' ', value: botBio, inline: false }
            )
            .setColor('#1E90FF')
            .setThumbnail(botAvatarURL)
            .setFooter({ text: 'KintaroBot', iconURL: botAvatarURL })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};