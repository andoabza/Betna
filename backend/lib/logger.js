// Logger file for the erros and the success messages
import winston from 'winston';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
export default logger;
export const logError = (error) => {
    logger.error(error);
};
export const logSuccess = (message) => {
    logger.info(message);
};
export const logWarning = (warning) => {
    logger.warn(warning);
}

