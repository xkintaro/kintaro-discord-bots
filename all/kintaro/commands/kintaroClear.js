const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Belirtilen sayıda mesajı siler.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Silinecek mesaj sayısı')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply("Bu komutu kullanmak için yetkiniz yok.");
        }

        if (amount < 1 || amount > 100) {
            return interaction.reply("Lütfen 1 ile 100 arasında geçerli bir sayı girin.");
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            return interaction.reply(`**${amount} mesaj başarıyla imha edildi!**`);
        } catch (error) {
            console.error(error);
            return interaction.reply("Mesajları silerken bir hata oluştu.");
        }
    },
};