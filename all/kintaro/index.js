const {
    Client,
    GatewayIntentBits,
    Collection,
    MessageFlags,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    AuditLogEvent
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const {
    token,
    GUILD_ID,
    KINTARO_ENTRY_EXIT,
    KINTARO_ENTRY_EXIT_GUARD_WELCOME_CHANNEL,
    KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE,
    KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE,
    KINTARO_ENTRY_EXIT_GUARD,
    KINTARO_JUMP_VOICE_AUTO,
    KINTARO_AUTO_RESPONSER,
    KINTARO_BOT_PUBLIC,
    KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS
} = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
});

const activeMessages = new Map();
const registeredUsers = new Map();
const cooldowns = new Map();

function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        console.log(`Loading event file: ${file}`);
        if (file === 'kintaroEntryExit.js' && KINTARO_ENTRY_EXIT !== 'true') continue;
        if (file === 'kintaroJumpVoiceAuto.js' && KINTARO_JUMP_VOICE_AUTO !== 'true') continue;
        if (file === 'kintaroAutoResponder.js' && KINTARO_AUTO_RESPONSER !== 'true') continue;

        const eventPath = path.join(eventsPath, file);
        if (fs.existsSync(eventPath)) {
            const event = require(eventPath);
            if (typeof event.execute === 'function') {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args));
                }
            } else {
                console.warn(`The "execute" function is not defined in the event file and is being skipped: ${file}`);
            }
        } else {
            console.warn(`Event file not found and is being skipped: ${file}`);
        }
    }
}

function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    client.commands = new Collection();
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`The "data" or "data.name" property is not defined in the command file and is being skipped: ${file}`);
        }
    }
}

async function deleteAfterDelay(interaction, delay = 10000) {
    setTimeout(async () => {
        try {
            if (interaction.ephemeral) {
                await interaction.deleteReply().catch(() => { });
            }
        } catch (error) {
            console.error('Message deletion error:', error);
        }
    }, delay);
}

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: 'An error occurred while running the command.',
                        flags: MessageFlags.Ephemeral
                    });
                    await deleteAfterDelay(interaction);
                }
            } catch (e) {
                console.error('Failed to send error response:', e);
            }
        }
    } else if (interaction.isButton()) {
        const userId = interaction.user.id;
        const cooldownTime = 1000;

        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId);
            if (Date.now() < expirationTime) {
                try {
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'Slow down a bit',
                            flags: MessageFlags.Ephemeral
                        });
                    } else {
                        await interaction.followUp({
                            content: 'Slow down a bit',
                            flags: MessageFlags.Ephemeral
                        });
                    }
                    return;
                } catch (error) {
                    console.error('Failed to send cooldown message:', error);
                    return;
                }
            }
        }

        cooldowns.set(userId, Date.now() + cooldownTime);
        setTimeout(() => cooldowns.delete(userId), cooldownTime);

        let isDeferred = false;
        try {
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferUpdate();
                isDeferred = true;
            }

            if (interaction.customId === 'remove_all_roles') {
                try {
                    const roller = interaction.message.components.flatMap(row =>
                        row.components.filter(c => c.customId && c.customId.startsWith('role_'))
                    ).map(c => c.customId.split('_')[1]);

                    const member = await interaction.guild.members.fetch(interaction.user.id);
                    const rolesToRemove = member.roles.cache.filter(r => roller.includes(r.id));

                    await member.roles.remove(rolesToRemove);

                    const updatedRows = interaction.message.components.map(row => {
                        const updatedRow = new ActionRowBuilder();
                        row.components.forEach(button => {
                            updatedRow.addComponents(ButtonBuilder.from(button));
                        });
                        return updatedRow;
                    });

                    await interaction.message.edit({ components: updatedRows });
                    if (isDeferred) {
                        await interaction.followUp({
                            content: 'All selected roles have been removed.',
                            flags: MessageFlags.Ephemeral
                        });
                        await deleteAfterDelay(interaction);
                    }
                } catch (error) {
                    console.error('Role removal error:', error);
                    if (isDeferred) {
                        await interaction.followUp({
                            content: 'An error occurred while removing roles.',
                            flags: MessageFlags.Ephemeral
                        });
                        await deleteAfterDelay(interaction);
                    }
                }
                return;
            }

            if (interaction.customId.startsWith('role_')) {
                try {
                    const roleId = interaction.customId.split('_')[1];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        if (isDeferred) {
                            await interaction.followUp({
                                content: 'This role was not found.',
                                flags: MessageFlags.Ephemeral
                            });
                            await deleteAfterDelay(interaction);
                        }
                        return;
                    }

                    const member = await interaction.guild.members.fetch(interaction.user.id);
                    const hasRole = member.roles.cache.has(role.id);

                    const messageContent = interaction.message.content.toLowerCase();
                    const isSingleRoleMode = messageContent.includes('tek_rol');

                    if (hasRole) {
                        await member.roles.remove(role);
                        if (isDeferred) {
                            await interaction.followUp({
                                content: `\`${role.name}\` role removed.`,
                                flags: MessageFlags.Ephemeral
                            });
                        }
                    } else {
                        if (isSingleRoleMode) {
                            const userRoles = member.roles.cache.map(r => r.id);
                            const selectableRoleIds = interaction.message.components.flatMap(row =>
                                row.components.filter(c => c.customId && c.customId.startsWith('role_'))
                            ).map(c => c.customId.split('_')[1]);

                            const rolesToRemove = userRoles.filter(id => selectableRoleIds.includes(id));
                            if (rolesToRemove.length > 0) {
                                await member.roles.remove(rolesToRemove);
                            }
                        }
                        await member.roles.add(role);
                        if (isDeferred) {
                            await interaction.followUp({
                                content: `\`${role.name}\` role added.`,
                                flags: MessageFlags.Ephemeral
                            });
                        }
                    }

                    const updatedRows = interaction.message.components.map(row => {
                        const updatedRow = new ActionRowBuilder();
                        row.components.forEach(button => {
                            updatedRow.addComponents(ButtonBuilder.from(button));
                        });
                        return updatedRow;
                    });

                    await interaction.message.edit({ components: updatedRows });
                } catch (error) {
                    console.error('Rol işlemi hatası:', error);
                    if (isDeferred) {
                        await interaction.followUp({
                            content: 'An error occurred during the role operation.',
                            flags: MessageFlags.Ephemeral
                        });
                    }
                }
            } else if (interaction.customId === 'registerButton') {

                const welcomeMessage = interaction.message;
                const memberIdMatch = welcomeMessage.content.match(/<@(\d+)>/);
                if (!memberIdMatch) return;
                const memberId = memberIdMatch[1];
                const member = interaction.guild.members.cache.get(memberId);
                const unverifiedRole = interaction.guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE);
                const verifiedRole = interaction.guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE);

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'You do not have permission to do this.',
                            flags: MessageFlags.Ephemeral
                        });
                    } else {
                        await interaction.followUp({
                            content: 'You do not have permission to do this.',
                            flags: MessageFlags.Ephemeral
                        });
                    }
                    return;
                }

                try {
                    await member.roles.remove(unverifiedRole);
                    await member.roles.add(verifiedRole);
                    registeredUsers.set(member.id, interaction.user);

                    await welcomeMessage.edit({
                        content: `${welcomeMessage.content}\n✅ This user was registered by ${interaction.user}.`,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('registerButton')
                                    .setLabel('Registered')
                                    .setStyle(ButtonStyle.Success)
                                    .setDisabled(true)
                            ),
                        ],
                    });

                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: `${member.user.tag} successfully registered!`,
                            flags: MessageFlags.Ephemeral
                        });
                    } else {
                        await interaction.followUp({
                            content: `${member.user.tag} successfully registered!`,
                            flags: MessageFlags.Ephemeral
                        });
                    }
                } catch (error) {
                    console.error(error);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'An error occurred!',
                            flags: MessageFlags.Ephemeral
                        });
                    } else {
                        await interaction.followUp({
                            content: 'An error occurred!',
                            flags: MessageFlags.Ephemeral
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Ana buton işlemi hatası:', error);
            try {
                if (!interaction.replied && !isDeferred) {
                    await interaction.reply({
                        content: 'An error occurred during the operation.',
                        flags: MessageFlags.Ephemeral
                    });
                    await deleteAfterDelay(interaction);
                } else if (isDeferred) {
                    await interaction.followUp({
                        content: 'An error occurred during the operation.',
                        flags: MessageFlags.Ephemeral
                    });
                    await deleteAfterDelay(interaction);
                }
            } catch (e) {
                console.error('Failed to send error response:', e);
            }
        }
    }
});

client.on('guildMemberAdd', async member => {
    if (KINTARO_ENTRY_EXIT_GUARD !== 'true') {
        console.log('Guard messages are disabled, the code will not run.');
        return;
    }

    try {
        const guild = member.guild;
        const welcomeChannel = guild.channels.cache.get(KINTARO_ENTRY_EXIT_GUARD_WELCOME_CHANNEL);
        const unverifiedRole = guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE);
        const verifiedRole = guild.roles.cache.get(KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE);

        if (!unverifiedRole || !verifiedRole || !welcomeChannel) {
            console.error('One or more roles or the welcome channel are invalid.');
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
            inviteMessage = `✉️ This user was invited by ${inviter}. (Code: ${inviteUsed})`;
        } else {
            try {
                const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberAdd, limit: 10 });
                const entry = auditLogs.entries.find(entry => entry.target.id === member.id);
                if (entry) {
                    const inviterFromAudit = entry.executor;
                    inviteMessage = `✉️ This user was invited by ${inviterFromAudit}.`;
                } else {
                    inviteMessage = '✉️ This user joined the server via a custom link or direct entry.';
                }
            } catch (error) {
                console.error('An error occurred while fetching audit logs:', error);
                inviteMessage = 'Invitation info could not be retrieved.';
            }
        }

        const memberCount = guild.memberCount;

        const welcomeMessage = await welcomeChannel.send({
            content: `👋 **${member.user.tag}** joined the server! Welcome ${member}! We now have **${memberCount}** members.\n${inviteMessage}`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('registerButton')
                        .setLabel('Register')
                        .setStyle(ButtonStyle.Primary)
                ),
            ],
        });

        activeMessages.set(member.id, welcomeMessage);
    } catch (error) {
        console.error(error);
    }
});

client.on('guildMemberRemove', async member => {
    if (KINTARO_ENTRY_EXIT_GUARD !== 'true') {
        console.log('Guard messages are disabled, the code will not run.');
        return;
    }

    try {
        const guild = member.guild;
        const memberCount = guild.memberCount;
        const exitChannel = guild.channels.cache.get(KINTARO_ENTRY_EXIT_GUARD_WELCOME_CHANNEL);

        const welcomeMessage = activeMessages.get(member.id);
        if (welcomeMessage) {
            const updatedMessage = `${welcomeMessage.content}\n❌ **${member.user.tag}** is no longer in the server. Registration not possible.`;

            await welcomeMessage.edit({
                content: updatedMessage,
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('registerButton')
                            .setLabel('User Left the Server')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    ),
                ],
            });

            activeMessages.delete(member.id);
            registeredUsers.delete(member.id);
        }

        if (exitChannel) {
            await exitChannel.send({
                content: `**${member}** left the server. We now have **${memberCount}** members.`,
                files: ['https://media.tenor.com/jotyiHEoUGUAAAAM/anime.gif']
            });
        }

    } catch (error) {
        console.error(error);
    }
});

function logFeatureStatus() {
    console.log(`\n⚙️・・・・・Features・・・・・⚙️\n`);
    console.log(`KINTARO_ENTRY_EXIT: ${KINTARO_ENTRY_EXIT === 'true' ? 'true' : 'false'}`);
    console.log(`KINTARO_ENTRY_EXIT_GUARD: ${KINTARO_ENTRY_EXIT_GUARD === 'true' ? 'true' : 'false'}`);
    console.log(`KINTARO_JUMP_VOICE_AUTO: ${KINTARO_JUMP_VOICE_AUTO === 'true' ? 'true' : 'false'}`);
    console.log(`KINTARO_AUTO_RESPONSER: ${KINTARO_AUTO_RESPONSER === 'true' ? 'true' : 'false'}`);
    console.log(`\n🔑・・・・・Access Permissions・・・・・🔑\n`);
    console.log(`KINTARO_BOT_PUBLIC: ${KINTARO_BOT_PUBLIC === 'true' ? 'true' : 'false'}`);
    console.log(`KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS: ${KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS === 'true' ? 'true' : 'false'}`);
}

function loadGuardEvents() {
    if (KINTARO_ENTRY_EXIT_GUARD === 'true') {
        const guardEvents = require('./events/kintaroEntryExitGuard');
        if (guardEvents.guildMemberAdd) {
            client.on('guildMemberAdd', guardEvents.guildMemberAdd);
        }
        if (guardEvents.guildMemberRemove) {
            client.on('guildMemberRemove', guardEvents.guildMemberRemove);
        }
    }
}

function loadKintaroEvents() {
    if (KINTARO_ENTRY_EXIT === 'true') {
        const kintaroEvents = require('./events/kintaroEntryExit');
        if (kintaroEvents.guildMemberAdd) {
            client.on('guildMemberAdd', kintaroEvents.guildMemberAdd);
        }
        if (kintaroEvents.guildMemberRemove) {
            client.on('guildMemberRemove', kintaroEvents.guildMemberRemove);
        }
    }
}

function handleGuildCreate() {
    client.on('guildCreate', async guild => {
        if (KINTARO_BOT_PUBLIC === 'true') {
            const welcomeMessage = 'Hi, I have arrived!';
            let sentMessage = false;

            let targetChannel = guild.systemChannel || guild.channels.cache.find(channel =>
                channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
            );

            if (targetChannel) {
                try {
                    await targetChannel.send(welcomeMessage);
                    sentMessage = true;
                } catch (error) {
                    console.error('Hoş geldin mesajı gönderilemedi:', error);
                }
            }

            if (!sentMessage) {
                for (const channel of guild.channels.cache.values()) {
                    if (channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
                        try {
                            await channel.send(welcomeMessage);
                            break;
                        } catch (error) {
                            console.error(`Kanal ${channel.name} için hoş geldin mesajı gönderilemedi:`, error);
                        }
                    }
                }
            }

            console.log(`Bot, yeni bir sunucuya katıldı: ${guild.name} (ID: ${guild.id})`);
        } else if (guild.id !== GUILD_ID) {
            const leaveMessage = 'This bot is configured to work only on a specific server. Leaving the server.';
            let sentMessage = false;

            let targetChannel = guild.systemChannel || guild.channels.cache.find(channel =>
                channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
            );

            if (targetChannel) {
                try {
                    await targetChannel.send(leaveMessage);
                    sentMessage = true;
                } catch (error) {
                    console.error('Mesaj gönderme hatası:', error);
                }
            }

            if (!sentMessage) {
                for (const channel of guild.channels.cache.values()) {
                    if (channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
                        try {
                            await channel.send(leaveMessage);
                            sentMessage = true;
                            break;
                        } catch (error) {
                            console.error(`Kanal ${channel.name} için mesaj gönderme hatası:`, error);
                        }
                    }
                }
            }

            if (sentMessage) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            await guild.leave();
            console.log(`Bot removed from unauthorized server: ${guild.name} (ID: ${guild.id})`);
        } else {
            console.log(`Bot joined authorized server: ${guild.name} (ID: ${guild.id})`);
        }
    });
}

function handleReadyEvent() {
    client.once('ready', async () => {
        console.log(`${client.user.tag} successfully logged in!\n`);
        console.log(`★ Bot is currently in ${client.guilds.cache.size} servers.`);

        client.guilds.cache.forEach(guild => {
            console.log(`   ✧ ${guild.name} (ID: ${guild.id})`);
        });

        for (const [guildId, guild] of client.guilds.cache) {
            if (KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS === 'true' && guild.id !== GUILD_ID) {
                const leaveMessage = 'This bot is configured to work only on a specific server. Leaving the server.';
                let sentMessage = false;

                let targetChannel = guild.systemChannel || guild.channels.cache.find(channel =>
                    channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
                );

                if (targetChannel) {
                    try {
                        await targetChannel.send(leaveMessage);
                        sentMessage = true;
                    } catch (error) {
                        console.error('Mesaj gönderme hatası:', error);
                    }
                }

                if (!sentMessage) {
                    for (const channel of guild.channels.cache.values()) {
                        if (channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
                            try {
                                await channel.send(leaveMessage);
                                sentMessage = true;
                                break;
                            } catch (error) {
                                console.error(`Kanal ${channel.name} için mesaj gönderme hatası:`, error);
                            }
                        }
                    }
                }

                if (sentMessage) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                await guild.leave();
                console.log(`Bot removed from unauthorized server: ${guild.name} (ID: ${guild.id})`);
            } else {
                try {
                    await guild.members.fetch();
                    console.log(`   * All members in ${guild.name} (ID: ${guild.id}) server have been cached.`);
                } catch (error) {
                    console.error(`   * Failed to cache members in ${guild.name} (ID: ${guild.id}) server: `, error);
                }
            }
        }
        console.log(`\n📚・・・・・Other・・・・・📚\n`);
    });
}

loadEvents();
loadCommands();
logFeatureStatus();
loadGuardEvents();
loadKintaroEvents();
handleGuildCreate();
handleReadyEvent();

client.login(token);