require('dotenv').config({ path: '../.env' });
const { PermissionsBitField, AuditLogEvent, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE, KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE, KINTARO_ENTRY_EXIT_GUARD } = process.env;

const activeMessages = new Map();
const registeredUsers = new Map();

let enableGuard = KINTARO_ENTRY_EXIT_GUARD === 'true';

module.exports = {
    name: 'kintaroEntryExitGuard',

    async guildMemberAdd(member) {
        if (!enableGuard) {
            console.log('Guard messages are disabled, the code will not run.');
            return;
        }

        try {
            const guild = member.guild;
            const unverifiedRole = guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE);
            const verifiedRole = guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE);

            if (!unverifiedRole || !verifiedRole) {
                console.error('One or more roles are invalid.');
                return;
            }

            await member.roles.add(unverifiedRole);

            let invitesAfter = await guild.invites.fetch();
            let inviter = null;
            let inviteUsed = null;

            const sortedInvites = [...invitesAfter.values()].sort((a, b) => b.uses - a.uses);

            for (const invite of sortedInvites) {
                if (invite.uses > 0) {
                    inviter = invite.inviter;
                    inviteUsed = invite.code;
                    break;
                }
            }

            let inviteMessage = '';
            if (inviter && inviteUsed) {
                inviteMessage = `✉️ Bu kullanıcı ${inviter} tarafından davet edildi. (Kod: ${inviteUsed})`;
            } else {
                try {
                    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberAdd, limit: 10 });
                    const entry = auditLogs.entries.find(entry => entry.target.id === member.id);
                    if (entry) {
                        const inviterFromAudit = entry.executor;
                        inviteMessage = `✉️ Bu kullanıcı ${inviterFromAudit} tarafından davet edildi.`;
                    } else {
                        inviteMessage = '✉️ Bu kullanıcı özel bir bağlantı veya direkt giriş yaparak sunucuya katıldı.';
                    }
                } catch (error) {
                    console.error('Error fetching audit logs:', error);
                    inviteMessage = 'Davet bilgisi alınamadı.';
                }
            }

            activeMessages.set(member.id, { inviter, inviteMessage });

        } catch (error) {
            console.error(error);
        }
    },

    async guildMemberRemove(member) {
        if (!enableGuard) {
            console.log('Guard messages are disabled, the code will not run.');
            return;
        }

        try {
            const guild = member.guild;
            activeMessages.delete(member.id);
            registeredUsers.delete(member.id);

        } catch (error) {
            console.error(error);
        }
    },

    async buttonInteraction(interaction) {
        if (interaction.customId === 'registerButton') {
            const memberId = interaction.message.content.match(/<@(\d+)>/)[1];
            const member = interaction.guild.members.cache.get(memberId);
            const unverifiedRole = interaction.guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE);
            const verifiedRole = interaction.guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE);

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'Bunu yapmak için yetkiniz yok.', flags: MessageFlags.Ephemeral });
                }
                return;
            }

            try {
                await member.roles.remove(unverifiedRole);
                await member.roles.add(verifiedRole);
                registeredUsers.set(member.id, interaction.user);

                await interaction.message.edit({
                    content: `${interaction.message.content}\n✅ Bu kullanıcı ${interaction.user} tarafından kayıt edildi.`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('registerButton')
                                .setLabel('Kayıt Edildi')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true)
                        ),
                    ],
                });

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: `${member.user.tag} başarıyla kayıt edildi!`, flags: MessageFlags.Ephemeral });
                }
            } catch (error) {
                console.error(error);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'Bir hata oluştu!', flags: MessageFlags.Ephemeral });
                }
            }
        }
    },
};