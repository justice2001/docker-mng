import * as winston from 'winston';
import * as process from 'node:process';

class Logger {
  protected _logger: winston.Logger;

  constructor() {
    this._logger = winston.createLogger({
      level: process.env.LOG_LEVEL || process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        winston.format.colorize(),
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${level}] (${label || 'app'}): ${message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
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
