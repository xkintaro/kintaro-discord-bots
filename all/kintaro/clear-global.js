const { REST, Routes } = require('discord.js');
require('dotenv').config();

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log('Clearing all global application (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: [] },
        );

        console.log('Successfully cleared all global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();