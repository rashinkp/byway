import http from "http";
import { envConfig } from "../configs/env.config";
import { WinstonLogger } from "../../../infra/providers/logging/winston.logger";
import { PrismaDatabaseProvider } from "../../../infra/database/postgres/prisma.database.provider";
import { setupSocketIO } from "../../socketio";
import { createAppDependencies } from "../../../di/app.dependencies";

const startServer = async (): Promise<void> => {
  const logger = new WinstonLogger();
  const databaseProvider = new PrismaDatabaseProvider(logger);

  try {
    await databaseProvider.connect();
    const deps = createAppDependencies();
    const app = require("./app").createApp(deps);
    const server = http.createServer(app);

    const PORT = envConfig.PORT || 5001;

    // --- Socket.IO Integration ---
    setupSocketIO(server, logger, deps.chatController);
    // --- End Socket.IO Integration ---

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
