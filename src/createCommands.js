const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const logger = require('./logger');
const fs = require('fs');

module.exports = () => new Promise(async (resolve, reject) => {
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data);
  };

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    logger.info('Successfully registered application commands.');
    resolve();
  } catch (error) {
    logger.error(error);
    reject(error);
  };
});