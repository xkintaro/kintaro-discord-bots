const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Kullanıcı profil bilgilerini gösterir.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Profilini görmek istediğiniz kullanıcıyı seçin')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);

            const sortedRoles = member.roles.cache
                .map(role => role.name)
                .sort((a, b) => a.localeCompare(b))
                .map(role => `\`${role}\``)
                .join(', ') || 'Hiç rolü yok';

            const accountStatus = user.bot ? 'Bot' : 'Güvenilir';

            const presenceStatus = !member.presence || member.presence.status === 'offline' ? 'Çevrimdışı' : 'Çevrimiçi';

            const voiceChannelStatus = member.voice.channel ? `Sesli kanalda: ${member.voice.channel.name}` : 'Sesli kanalda değil';

            const boostStatus = member.premiumSince ? `Sunucuyu boostluyor (Boost tarihi: ${member.premiumSince.toLocaleDateString()})` : 'Sunucuyu boostlamıyor';

            const profilEmbed = {
                color: 0x1E90FF,
                title: `📋 ${user.username} Profil Bilgisi`,
                fields: [
                    {
                        name: '👤 Kullanıcı Adı:',
                        value: `${user.username}`,
                        inline: true,
                    },
                    {
                        name: '📅 Hesap Oluşturulma Tarihi:',
                        value: user.createdAt.toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: '📅 Katılma Tarihi:',
                        value: member.joinedAt.toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: '⚙️ Hesap Durumu:',
                        value: accountStatus,
                        inline: true,
                    },
                    {
                        name: '🔵 Aktiflik Durumu:',
                        value: presenceStatus,
                        inline: true,
                    },
                    {
                        name: '🚀 Boost Durumu:',
                        value: boostStatus,
                        inline: true,
                    },
                    {
                        name: '🔊 Sesli Kanal Durumu:',
                        value: voiceChannelStatus,
                        inline: false,
                    },
                    {
                        name: '📜 Roller:',
                        value: sortedRoles,
                        inline: false,
                    },
                ],
                thumbnail: {
                    url: user.displayAvatarURL({ dynamic: true, size: 1024 }),
                },
                footer: {
                    text: 'Bot tarafından sağlanıyor',
                    icon_url: interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 }),
                },
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [profilEmbed] });
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Bir hata oluştu.' });
            }
        }
    },
};