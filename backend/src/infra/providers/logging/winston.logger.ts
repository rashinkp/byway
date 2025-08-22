import winston from "winston";
import { envConfig } from "../../../presentation/express/configs/env.config";
import { ILogger } from "../../../app/providers/logger-provider.interface";

export class WinstonLogger implements ILogger {
  private _logger: winston.Logger;

  constructor() {
    this._logger = winston.createLogger({
      level: envConfig.LOG_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: envConfig.LOG_FILE_PATH }),
        new winston.transports.Console(),
      ],
    });
  }

  info(message: string): void {
    this._logger.info(message);
  }

  error(message: string, error?: unknown): void {
    this._logger.error(message, error);
  }

  warn(message: string): void {
    this._logger.warn(message);
  }

  debug(message: string): void {
    this._logger.debug(message);
  }
}
