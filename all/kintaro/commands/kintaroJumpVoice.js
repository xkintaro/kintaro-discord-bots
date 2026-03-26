const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jumpvoice')
        .setDescription('Bot, bulunduğun ses kanalına katılır.'),
    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply("Bu komutu kullanmak için admin yetkisine sahip olmanız gerekiyor!");
        }

        if (!voiceChannel) {
            return interaction.reply("Bir ses kanalına katılmanız gerekiyor!");
        }

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            return interaction.reply(`Bot ${voiceChannel.name} kanalına katıldı!`);
        } catch (error) {
            console.error(error);
            return interaction.reply("Bir hata oluştu, lütfen tekrar deneyin.");
        }
    },
};