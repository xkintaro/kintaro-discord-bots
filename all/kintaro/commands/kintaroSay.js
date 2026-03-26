const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Belirtilen kanalda belirttiğiniz mesajı gönderir.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Mesajın gönderileceği kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Gönderilecek mesaj')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsiniz.', flags: MessageFlags.Ephemeral });
        }

        const channel = interaction.options.getChannel('kanal');
        let message = interaction.options.getString('mesaj');

        message = message.replace(/\\n/g, '\n');

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'Lütfen geçerli bir metin kanalı seçin.', flags: MessageFlags.Ephemeral });
        }

        try {
            await channel.send(message);
            await interaction.reply({ content: 'Mesaj başarıyla gönderildi!', flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.error('Mesaj gönderilemedi:', error);
            await interaction.reply({ content: 'Mesaj gönderilirken bir hata oluştu.', flags: MessageFlags.Ephemeral });
        }
    },
};