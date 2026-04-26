import 'dotenv/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const logsDir = 'logs';
const logDir = path.resolve(logsDir);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const isProduction = process.env.NODE_ENV === 'production';

const envLogFileSize = parseInt(process.env.LOG_FILE_MAX_SIZE, 10);
const LOG_LEVEL =
  process.env.LOG_LEVEL !== undefined && process.env.LOG_LEVEL !== 'log'
    ? process.env.LOG_LEVEL
    : 'info';
const LOG_FILE_MAX_SIZE =
  typeof envLogFileSize === 'number' ? envLogFileSize : 1024;

const dailyRotateFile = new winston.transports.DailyRotateFile({
  level: LOG_LEVEL,
  maxSize: `${LOG_FILE_MAX_SIZE}k`,
  filename: `app.log`,
  dirname: logsDir,
});

let winstonFormat;
if (isProduction) {
  winstonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  );
} else {
  winstonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) => {
      // Если есть stack trace, добавляем его в сообщение
      const stack = info.stack ? `\n${info.stack}` : '';
      const readableMessage = [];
      if (typeof info.message === 'object') {
        if (
          'method' in info.message &&
          typeof info.message.method === 'string'
        ) {
          readableMessage.push(`method ${info.message.method}`);
        }
        if ('url' in info.message && typeof info.message.url === 'string') {
          readableMessage.push(`url ${info.message.url}`);
        }
        if (
          'params' in info.message &&
          typeof info.message.params === 'object'
        ) {
          readableMessage.push(`params ${JSON.stringify(info.message.params)}`);
        }
        if ('body' in info.message && typeof info.message.body === 'object') {
          readableMessage.push(`body ${JSON.stringify(info.message.body)}`);
        }
        if (
          'responseTime' in info.message &&
          typeof info.message.responseTime === 'number'
        ) {
          readableMessage.push(`responseTime ${info.message.responseTime}`);
        }
        if (
          'statusCode' in info.message &&
          typeof info.message.statusCode === 'number'
        ) {
          readableMessage.push(`statusCode ${info.message.statusCode}`);
        }
      } else {
        readableMessage.push(info.message);
      }

      return `[${info.timestamp}] [${info.level}]: ${readableMessage.join(' ')}${stack}\n`;
    }),
  );
}

export const winstonLogger = winston.createLogger({
  level: LOG_LEVEL,
  format: winstonFormat,
  transports: [
    dailyRotateFile,
    new winston.transports.Console({
      level: LOG_LEVEL,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
      ),
    }),
  ],
});
