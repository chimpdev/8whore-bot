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

  client.on('messageCreate', async message => {
    if (message.partial) await message.fetch();
    if (message.author.id !== process.env.DEVELOPER_ID) return;

    if (message.content.startsWith('!eval')) {
      const util = require('util');
      const code = message.content.split(' ').slice(1).join(' ');

      try {
        logger.info(`Evaluating code: ${code}`);
        const isAsync = code.includes('return') || code.includes('await');
        const result = isAsync ? await eval(`(async () => { ${code} })()`) : eval(code);
        const inspected = util.inspect(result, { depth: 0 });
        
        await message.reply({ embeds: [{ description: `\`\`\`js\n${inspected}\n\`\`\`` }], allowedMentions: { repliedUser: false } });
      } catch (error) {
        logger.error(error);
        await message.reply({ embeds: [{ description: `\`\`\`js\n${error}\n\`\`\`` }], allowedMentions: { repliedUser: false } });
      };
    };
  });

  client.login(process.env.TOKEN);
})();