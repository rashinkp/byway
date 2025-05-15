import http from "http";
import { createApp } from "./app";
import { envConfig } from "../configs/env.config";
import { WinstonLogger } from "../../../infra/providers/logging/winston.logger";
import { PrismaDatabaseProvider } from "../../../infra/database/postgres/prisma.database.provider";

const startServer = async (): Promise<void> => {
  const logger = new WinstonLogger();
  const databaseProvider = new PrismaDatabaseProvider(logger);

  try {
    await databaseProvider.connect();
    const app = createApp();
    const server = http.createServer(app);

    const PORT = envConfig.PORT || 5001;

    server.listen(PORT, () => {
      logger.info(`🔥 Server running on port ${PORT}`);
    });

    server.on("error", (error) => {
      logger.error("Server error", error);
    });

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      await databaseProvider.disconnect();
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
