import winston from "winston";

const logLevel = process.env.LOG_LEVEL || "info";
const logFilePath = process.env.LOG_FILE_PATH || "./logs/app.log";

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Silence console logging in test environment
if (process.env.NODE_ENV === "test") {
  logger.transports.forEach((transport) => {
    if (transport instanceof winston.transports.Console) {
      transport.silent = true;
    }
  });
}

/* Winston is a logging library for Node.js. It helps you:

Keep track of errors, warnings, and info

Store logs in files

Print logs to the console

Easily format logs with timestamps, JSON, etc.

Debug more easily in dev and track issues in production

*/
