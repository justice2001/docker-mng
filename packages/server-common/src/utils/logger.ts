import * as winston from 'winston';
import * as process from 'node:process';
import { logPath } from './base-path';
import path from 'node:path';

class Logger {
  protected _logger: winston.Logger;

  constructor() {
    const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${level}] (${label || 'app'}): ${message}`;
    });

    this._logger = winston.createLogger({
      level: process.env.LOG_LEVEL || process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format((info) => {
              info.level = info.level.toUpperCase();
              return info;
            })(),
            winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            winston.format.colorize(),
            myFormat,
          ),
        }),
        new winston.transports.File({
          filename: path.join(logPath, 'logs.log'),
          level: 'info',
          format: winston.format.combine(
            winston.format((info) => {
              info.level = info.level.toUpperCase();
              return info;
            })(),
            winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            myFormat,
          ),
        }),
      ],
    });
  }

  info(message: string, scope?: string) {
    this._logger.info(message, { label: scope });
  }

  debug(message: string, scope?: string) {
    this._logger.debug(message, { label: scope });
  }

  error(message: string, scope?: string) {
    this._logger.error(message, { label: scope });
  }

  warn(message: string, scope?: string) {
    this._logger.warn(message, { label: scope });
  }
}

export default new Logger();
