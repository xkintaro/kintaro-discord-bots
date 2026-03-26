const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Sunucu hakkında bilgileri gösterir.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        const creationDate = guild.createdAt.toLocaleDateString();
        const memberCount = guild.memberCount;

        const totalChannelCount = guild.channels.cache.size;
        const categoryChannelCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size;
        const channelCount = totalChannelCount - categoryChannelCount;
        const textChannelCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
        const voiceChannelCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;

        const roleCount = guild.roles.cache.size;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;

        await guild.members.fetch();

        const adminCount = guild.members.cache.filter(member =>
            member.permissions.has(PermissionsBitField.Flags.Administrator)
        ).size;

        const adminUsers = guild.members.cache
            .filter(member => member.permissions.has(PermissionsBitField.Flags.Administrator))
            .map(member => member.user.tag)
            .sort((a, b) => a.localeCompare(b))
            .map(user => `\`${user}\``)
            .join(', ');

        const serverIcon = guild.iconURL({ dynamic: true, size: 1024 });

        const roles = guild.roles.cache
            .map(role => role.name)
            .sort((a, b) => a.localeCompare(b))
            .map(role => `\`${role}\``)
            .join(', ');

        const serverStatsEmbed = {
            color: 0x1E90FF,
            title: `📊 ${guild.name} Sunucu Bilgileri`,
            thumbnail: {
                url: serverIcon,
            },
            fields: [
                {
                    name: '👑 Sunucu Sahibi',
                    value: `${owner.user.tag}`,
                    inline: true,
                },
                {
                    name: '📅 Oluşturulma Tarihi',
                    value: creationDate,
                    inline: true,
                },
                {
                    name: '👥 Üye Sayısı',
                    value: `${memberCount}`,
                    inline: true,
                },
                {
                    name: '🤖 Bot Sayısı',
                    value: `${botCount}`,
                    inline: true,
                },
                {
                    name: '📚 Toplam Kanal Sayısı',
                    value: `${channelCount}`,
                    inline: true,
                },
                {
                    name: '📝 Metin Kanalları',
                    value: `${textChannelCount}`,
                    inline: true,
                },
                {
                    name: '🔊 Ses Kanalları',
                    value: `${voiceChannelCount}`,
                    inline: true,
                },
                {
                    name: '🔖 Rol Sayısı',
                    value: `${roleCount}`,
                    inline: true,
                },
                {
                    name: '🔧 Admin Sayısı',
                    value: `${adminCount}`,
                    inline: true,
                },
                {
                    name: '📜 Roller',
                    value: roles,
                    inline: false,
                },
                {
                    name: '🔧 Admin kullanıcılar',
                    value: adminUsers,
                    inline: false,
                },
            ],
            footer: {
                text: `İsteği gerçekleştiren: ${interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [serverStatsEmbed] });
    },
};