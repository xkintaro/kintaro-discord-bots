const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const {
    DISCORD_TOKEN,
    GUILD_ID,
    KINTARO_JUMP_VOICE_AUTO,
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

console.log(`\nBot Starting...\n`);

const eventsPath = './events';
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    if (file === 'kintaroJumpVoiceAuto.js' && KINTARO_JUMP_VOICE_AUTO !== 'true') continue;

    const event = require(`${eventsPath}/${file}`);
    if (event.execute) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    } else {
        console.warn(`The "execute" function is not defined in the event file and is being skipped. ${file}`);
    }
}

const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`${commandsPath}/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Command failed.' });
    }
});

console.log(`\n⚙️・・・・・Features・・・・・⚙️\n`);
console.log(`KINTARO_JUMP_VOICE_AUTO: ${KINTARO_JUMP_VOICE_AUTO === 'true' ? 'true' : 'false'}`);
console.log(`\n🔑・・・・・Erişim İzinleri・・・・・🔑\n`);
console.log(`KINTARO_BOT_PUBLIC: ${KINTARO_BOT_PUBLIC === 'true' ? 'true' : 'false'}`);
console.log(`KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS: ${KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS === 'true' ? 'true' : 'false'}`);

client.on('guildCreate', async guild => {
    if (KINTARO_BOT_PUBLIC === 'true') {
        const welcomeMessage = 'Hi, I\'m here!';
        await sendMessageToChannel(guild, welcomeMessage);
        console.log(`Bot joined a new server: ${guild.name} (ID: ${guild.id})`);
    } else if (guild.id !== GUILD_ID) {
        const leaveMessage = 'This bot is only set to work in a specific server. I am leaving the server.';
        await sendMessageToChannel(guild, leaveMessage);
        await guild.leave();
        console.log(`Bot left an unauthorized server: ${guild.name} (ID: ${guild.id})`);
    } else {
        console.log(`Bot joined an authorized server: ${guild.name} (ID: ${guild.id})`);
    }
});

console.log(`\n🌐・・・・・Activity・・・・・🌐\n`);

client.once('ready', async () => {
    console.log(`${client.user.tag} successfully logged in!\n`);
    console.log(`★ The bot is currently in ${client.guilds.cache.size} servers.`);

    client.guilds.cache.forEach(guild => {
        console.log(`   ✧ ${guild.name} (ID: ${guild.id})`);
    });

    for (const [guildId, guild] of client.guilds.cache) {
        if (KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS === 'true' && guild.id !== GUILD_ID) {
            const leaveMessage = 'This bot is only set to work in a specific server. I am leaving the server.';
            await sendMessageToChannel(guild, leaveMessage);
            await guild.leave();
            console.log(`Bot left an unauthorized server: ${guild.name} (ID: ${guild.id})`);
        } else {
            try {
                await guild.members.fetch();
                console.log(`   * ${guild.name} (ID: ${guild.id}) server's all members were cached.`);
            } catch (error) {
                console.error(`   * ${guild.name} (ID: ${guild.id}) server's members could not be cached: `, error);
            }
        }
    }
    console.log(`\n📚・・・・・Other・・・・・📚\n`);
});

async function sendMessageToChannel(guild, message) {
    let sentMessage = false;

    let targetChannel = guild.systemChannel || guild.channels.cache.find(channel =>
        channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
    );

    if (targetChannel) {
        try {
            await targetChannel.send(message);
            sentMessage = true;
        } catch (error) {
            console.error('Message sending error:', error);
        }
    }

    if (!sentMessage) {
        for (const channel of guild.channels.cache.values()) {
            if (channel.type === 0 && channel.permissionsFor(guild.members.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
                try {
                    await channel.send(message);
                    break;
                } catch (error) {
                    console.error(`Channel ${channel.name} for message sending error:`, error);
                }
            }
        }
    }
}

client.login(DISCORD_TOKEN);