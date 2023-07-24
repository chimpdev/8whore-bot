const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, printf } = format;

const logger = createLogger({
  format: combine(colorize(), timestamp(), printf(({ level, message, timestamp }) => `${level} | ${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()}\n${message}\n`)),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'log/winston.log' })
  ]
});

module.exports = logger;