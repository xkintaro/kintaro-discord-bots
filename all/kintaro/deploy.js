const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${commandsPath}/${file}`);
    if (command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
    } else {
        console.error(`Komut dosyasında "data" nesnesi veya "toJSON" fonksiyonu eksik: ${file}`);
    }
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();