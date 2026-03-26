const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copymessage')
        .setDescription('Belirtilen kanala belirttiğiniz mesajı kopyalar.')
        .addChannelOption(option =>
            option.setName('hedef_kanal')
                .setDescription('Mesajın kopyalanacağı kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option =>
            option.setName('kaynak_kanal')
                .setDescription('Kopyalanacak Mesajın bulunduğu kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option =>
            option.setName('mesaj_id')
                .setDescription('Kopyalanacak mesajın ID\'si')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsiniz.', flags: MessageFlags.Ephemeral });
        }

        const sourceChannel = interaction.options.getChannel('kaynak_kanal');
        const targetChannel = interaction.options.getChannel('hedef_kanal');
        const messageId = interaction.options.getString('mesaj_id');

        if (sourceChannel.type !== ChannelType.GuildText || targetChannel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'Lütfen geçerli metin kanalları seçin.', flags: MessageFlags.Ephemeral });
        }

        try {
            const message = await sourceChannel.messages.fetch(messageId);

            if (!message) {
                return interaction.reply({ content: 'Belirtilen mesaj bulunamadı.', flags: MessageFlags.Ephemeral });
            }

            await targetChannel.send({
                content: message.content,
                embeds: message.embeds.length ? message.embeds : []
            });

            await interaction.reply({ content: 'Mesaj başarıyla kopyalandı!', flags: MessageFlags.Ephemeral });
        } catch (error) {
            if (error.code === 10008) {
                await interaction.reply({ content: 'Belirtilen mesaj bulunamadı.', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'Mesaj kopyalanırken bir hata oluştu.', flags: MessageFlags.Ephemeral });
            }
        }
    },
};