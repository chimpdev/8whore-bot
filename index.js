(async () => {
  const logger = require('./src/logger');
  require('dotenv').config();

  if (process.argv.includes('--registerCommands')) await require('./src/createCommands')();
  
  const { registerFont } = require('canvas');
  registerFont('arial.ttf', { family: 'Arial' });
  
  const Discord = require('discord.js');
  const client = new Discord.Client({ intents: Object.values(Discord.GatewayIntentBits).filter(bit => typeof bit == 'number') });
  client.on('ready', () => logger.info(`Logged in as ${client.user.tag} (${client.user.id}).`));

  client.on('interactionCreate', async interaction => {
    const command = require(`./commands/${interaction.commandName}`);
    return command.execute(interaction).catch(error => logger.error(error));
  });

  client.login(process.env.TOKEN);
})();