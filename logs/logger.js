const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');

// Use /tmp/logs for writable logs in serverless environments
const logDirectory = process.env.SERVERLESS ? path.join('/tmp', 'logs') : path.join(__dirname, 'logs');

// Ensure the directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}
// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: `${logDirectory}/%DATE%-combined.log`,
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
        new DailyRotateFile({
            filename: `${logDirectory}/%DATE%-error.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
        }),
    ],
});

// Add console logging for non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

module.exports = logger;
