const { ApplicationCommandType } = require('discord-api-types/v10');
const logger = require('../src/logger');
const Discord = require('discord.js');

module.exports = {
  data: {
    name: '8whore',
    type: ApplicationCommandType.User,
    dm_permission: false,
    integration_types: [1],
    contexts: [0, 2]
  },
  execute: async interaction => {
    try {
      await interaction.deferReply();

      const logs = [
        {
          message: `8whore command executed by ${interaction.user.tag} (${interaction.user.id})`,
          date: Date.now()
        }
      ];

      const canvas = require('canvas');
      const image = await canvas.loadImage('https://i.imgur.com/pgVbQST.jpg');
      logs.push({ message: 'Image loaded.', date: Date.now() });
      const newCanvas = canvas.createCanvas(image.width, image.height)
      const ctx = newCanvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      logs.push({ message: 'Image drawn.', date: Date.now() });

      ctx.save();

      logs.push({ message: 'Avatar 1 clipping started.', date: Date.now() });
      const avatar1_radius = 25;
      const avatar1_centerX = 119 + avatar1_radius;
      const avatar1_centerY = 181 + avatar1_radius;
      ctx.beginPath();
      ctx.arc(avatar1_centerX, avatar1_centerY, avatar1_radius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.clip();
      logs.push({ message: 'Avatar 1 clipping ended.', date: Date.now() });

      const avatar1 = await canvas.loadImage(interaction.options.getUser('user').displayAvatarURL({ extension: 'jpg' }));
      ctx.drawImage(avatar1, 119, 181, 50, 50);
      logs.push({ message: 'Avatar 1 drawn.', date: Date.now() });

      ctx.restore();
      ctx.save();

      logs.push({ message: 'Avatar 2 clipping started.', date: Date.now() });
      const avatar2_radius = 40;
      const avatar2_centerX = 25 + avatar2_radius;
      const avatar2_centerY = 15 + avatar2_radius;
      ctx.beginPath();
      ctx.arc(avatar2_centerX, avatar2_centerY, avatar2_radius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.clip();
      logs.push({ message: 'Avatar 2 clipping ended.', date: Date.now() });

      const avatar2 = await canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));
      ctx.drawImage(avatar2, 25, 15, 80, 80);
      logs.push({ message: 'Avatar 2 drawn.', date: Date.now() });

      ctx.restore();
      ctx.save();

      function placeText(ctx, text_background_x, text_background_y, text_background_width, text_background_height, text, text_font_size, text_font_family, text_color, text_x, text_y) {
        ctx.fillStyle = text_color;
        ctx.fillRect(text_background_x, text_background_y, text_background_width, text_background_height);

        ctx.font = `bold ${text_font_size}px ${text_font_family}`;
        ctx.fillStyle = '#000000';

        let textWidth = ctx.measureText(text).width;
        while (textWidth > text_background_width - 10) {
          text_font_size--;
          ctx.font = `bold ${text_font_size}px ${text_font_family}`;
          textWidth = ctx.measureText(text).width;
        };

        ctx.fillText(text, text_x, text_y);
      };
      
      logs.push({ message: 'Text placement started.', date: Date.now() });

      const member = interaction.guildId ? await interaction.guild.members.fetch(interaction.options.getUser('user').id) : null;
      const interactionMember = interaction.guildId ? await interaction.guild.members.fetch(interaction.member.id) : null;

      placeText(ctx, 120, 14, 172, 40, interaction.guildId ? interactionMember.displayName : interaction.user.username, 30, 'Arial', '#ffffff', 120, 14 + 30);
      placeText(ctx, 170, 180, 240, 40, interaction.guildId ? member.displayName : interaction.options.getUser('user').username, 25, 'Arial', '#ffffff', 185, 185 + 25);
      logs.push({ message: 'Text placement ended.', date: Date.now() });

      logs.push({ message: 'Attachment creation started.', date: Date.now() });
      const attachment = new Discord.AttachmentBuilder(newCanvas.toBuffer(), { name: 'whoreit.png' });
      logs.push({ message: 'Attachment created.', date: Date.now() });

      logs.push({ message: 'Response sending started.', date: Date.now() });
      interaction.followUp({ files: [attachment] }).then(() => {
        logs.push({ message: 'Response sent.', date: Date.now() });
        logs.push({ message: `Command execution completed in ${Date.now() - interaction.createdTimestamp}ms.`, date: Date.now() });
        logger.info(logs.map(log => `${new Date(log.date).toLocaleDateString()} ${new Date(log.date).toLocaleTimeString()}.${new Date(log.date).getMilliseconds().toString().padStart(3, '0')} | ${log.message}`).join('\n'));
      });
    } catch(error) {
      logger.error(error);
      interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    };
  }
};
