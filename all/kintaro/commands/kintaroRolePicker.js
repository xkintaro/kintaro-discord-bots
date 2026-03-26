const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolepicker')
        .setDescription('Rol seçici mesajı gönderir.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Mesajın gönderileceği kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option =>
            option.setName('mod')
                .setDescription('Rol seçme modu')
                .setRequired(true)
                .addChoices(
                    { name: 'Sadece bir tane rol seçmeye izin ver', value: 'tek_rol' },
                    { name: 'Birden fazla rol seçmeye izin ver', value: 'coklu_rol' }
                ))
        .addStringOption(option =>  
            option.setName('roller')
                .setDescription('Eklemek istediğiniz rolleri etiketleyerek girin')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Gönderilecek mesaj')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsiniz.', flags: MessageFlags.Ephemeral });
        }

        const channel = interaction.options.getChannel('kanal');
        const mod = interaction.options.getString('mod');
        const roller = interaction.options.getString('roller').match(/<@&(\d+)>/g);
        const mesaj = interaction.options.getString('mesaj');

        if (!roller) {
            return await interaction.reply({ content: 'Lütfen en az bir rol etiketleyin.', flags: MessageFlags.Ephemeral });
        }

        const actionRows = [];
        let currentRow = new ActionRowBuilder();

        for (const roleMention of roller) {
            const roleId = roleMention.replace(/<@&|>/g, '');
            const role = interaction.guild.roles.cache.get(roleId);

            if (role) {
                const button = new ButtonBuilder()
                    .setCustomId(`role_${role.id}`)
                    .setLabel(role.name)
                    .setStyle(ButtonStyle.Primary);

                if (currentRow.components.length === 5) {
                    actionRows.push(currentRow);
                    currentRow = new ActionRowBuilder();
                }

                currentRow.addComponents(button);
            }
        }

        if (currentRow.components.length > 0) {
            actionRows.push(currentRow);
        }

        if (actionRows.length === 0) {
            return await interaction.reply({ content: 'Geçerli bir rol bulunamadı.', flags: MessageFlags.Ephemeral });
        }

        const removeAllRolesButton = new ButtonBuilder()
            .setCustomId('remove_all_roles')
            .setLabel('Seçilen rolleri kaldır')
            .setStyle(ButtonStyle.Danger);

        if (actionRows[actionRows.length - 1].components.length < 5) {
            actionRows[actionRows.length - 1].addComponents(removeAllRolesButton);
        } else {
            const newRow = new ActionRowBuilder().addComponents(removeAllRolesButton);
            actionRows.push(newRow);
        }

        const finalMessage = `${mesaj.replace(/\\n/g, '\n')}\n\n✧ Mod: ${mod}`;
        await channel.send({ content: finalMessage, components: actionRows });
        await interaction.reply({ content: 'Rol seçici mesajı başarıyla gönderildi!', flags: MessageFlags.Ephemeral });
    }
};
