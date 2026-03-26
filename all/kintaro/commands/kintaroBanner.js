const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Etiketlenen kullanıcının banner resmini gösterir.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Banner resmini görmek istediğiniz kullanıcıyı seçin')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');

            const userBanner = await interaction.client.users.fetch(user.id, { force: true });

            if (userBanner.banner) {
                const bannerUrl = userBanner.bannerURL({ dynamic: true, size: 1024 });

                const bannerEmbed = {
                    color: 0x1E90FF,
                    title: `${user.username} Bannerı`,
                    image: {
                        url: bannerUrl,
                    },
                    footer: {
                        text: `Banner isteğinde bulunan: ${interaction.user.username}`,
                        icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
                    },
                    timestamp: new Date(),
                };

                await interaction.reply({ embeds: [bannerEmbed] });
            } else {

                await interaction.reply({ content: `${user.username} kullanıcısının banner resmi yok.` });
            }
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Bir hata oluştu.' });
            }
        }
    },
};