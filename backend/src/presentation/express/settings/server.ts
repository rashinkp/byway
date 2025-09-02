import http from "http";
import { envConfig } from "../configs/env.config";
import { PrismaDatabaseProvider } from "../../../infra/database/postgres/prisma.database.provider";
import { setupSocketIO } from "../../socketio";
import { createAppDependencies } from "../../../di/app.dependencies";
import { createApp } from "./app";

const startServer = async (): Promise<void> => {
  try {
    const deps = createAppDependencies();
    const databaseProvider = new PrismaDatabaseProvider(deps.logger);
    await databaseProvider.connect();
    const app = createApp(deps, deps.logger);
    const server = http.createServer(app);

    const PORT = envConfig.PORT || 5001;

    // --- Socket.IO Integration ---
    setupSocketIO(server, deps.logger, deps.chatController, deps.notificationController);
    // --- End Socket.IO Integration ---

    server.listen(PORT, () => {
      deps.logger.info(`🔥 Server running on port ${PORT}`);
    });

    server.on("error", (error) => {
      deps.logger.error("Server error", {error});
    });

    process.on("SIGTERM", async () => {
      deps.logger.info("SIGTERM received. Shutting down gracefully...");
      await databaseProvider.disconnect();
      server.close(() => {
        deps.logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    // If deps hasn't been created or logger isn't available yet, fallback to console
    try {
      const deps = createAppDependencies();
      deps.logger.error("Failed to start server", {error});
    } catch (_) {
      // last resort
      console.error("Failed to start server", error);
    }
    process.exit(1);
  }
};

startServer();
