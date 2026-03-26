const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Etiketlenen kullanıcının avatar resmini gösterir.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Avatarını görmek istediğiniz kullanıcıyı seçin')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const avatarEmbed = {
            color: 0x1E90FF,
            title: `${user.username} Avatarı`,
            image: {
                url: avatarUrl,
            },
            footer: {
                text: `Avatar isteğinde bulunan: ${interaction.user.username}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};