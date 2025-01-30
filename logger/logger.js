// logger.js
const { createLogger, format, transports } = require('winston');

// Create a logger instance
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`; // Custom log format
        })
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;
