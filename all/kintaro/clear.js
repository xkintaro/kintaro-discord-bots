const { REST, Routes } = require('discord.js');
require('dotenv').config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log('Clearing all application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: [] },
        );

        console.log('Successfully cleared all application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();