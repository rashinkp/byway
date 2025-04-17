import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});


/* Winston is a logging library for Node.js. It helps you:

Keep track of errors, warnings, and info

Store logs in files

Print logs to the console

Easily format logs with timestamps, JSON, etc.

Debug more easily in dev and track issues in production

*/