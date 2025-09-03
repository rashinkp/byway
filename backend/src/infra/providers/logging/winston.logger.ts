import winston from "winston";
import fs from "fs";
import path from "path";
import { envConfig } from "../../../presentation/express/configs/env.config";
import { ILogger } from "../../../app/providers/logger-provider.interface";

export class WinstonLogger implements ILogger {
  private _logger: winston.Logger;

  constructor() {
    const logFilePath = envConfig.LOG_FILE_PATH;
    const logDir = path.dirname(logFilePath);

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this._logger = winston.createLogger({
      level: envConfig.LOG_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: logFilePath,
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true,
        }),
        new winston.transports.File({
          level: "error",
          filename: path.join(logDir, "error.log"),
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
          tailable: true,
        }),
        new winston.transports.Console(),
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: path.join(logDir, "exceptions.log") }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: path.join(logDir, "rejections.log") }),
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
