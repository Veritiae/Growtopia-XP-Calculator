const { Client, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');

// Initialize the client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command collection to store commands
client.commands = new Map();

// Load commands dynamically from the 'commands' folder
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Registering commands dynamically every time the bot restarts
const commands = [];
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
});

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register commands with Discord API
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Handling interactions with slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log the bot into Discord
client.once('ready', () => {
    console.log(`Logged into bot ${client.user.tag}`);
});

// Log the bot in
client.login(token);
