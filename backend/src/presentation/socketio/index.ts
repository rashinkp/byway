import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "./socket.auth";
import { registerChatHandlers } from "./handlers/chat.handlers";
import { registerMessageHandlers } from "./handlers/message.handlers";
import { registerRoomHandlers } from "./rooms/join-leave.handlers";
import { registerNotificationHandlers } from "./handlers/notification.handlers";
import { ChatController } from "../http/controllers/chat.controller";
import { NotificationController } from '../http/controllers/notification.controller';
import { ILogger } from "../../app/providers/logger-provider.interface";
import { envConfig } from "../express/configs/env.config";
let ioInstance: SocketIOServer | null = null;

export function setupSocketIO(
  server: HTTPServer,
  logger: ILogger,
  chatController: ChatController,
  notificationController: NotificationController,
) {
  const io = new SocketIOServer(server, {
    path: "/socket.io",
    cors: {
      origin: envConfig.CORS_ORIGIN || envConfig.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    // Configuration for reverse proxy (Render uses a reverse proxy)
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });
  ioInstance = io;

  logger.info(`Socket.IO server initialized on path: /socket.io`);
  logger.info(`Socket.IO CORS origin: ${envConfig.CORS_ORIGIN || envConfig.FRONTEND_URL}`);
  
  // Verify Socket.IO is properly attached
  io.engine.on("connection_error", (err) => {
    logger.error(`Socket.IO connection error: ${err.message}`, { err });
  });

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const userId = socket.data.user?.id;
    logger.info(`Socket connected: ${socket.id}, userId: ${userId || 'unauthenticated'}, hasAuth: ${!!socket.data.user}`);

    if (userId) {
      socket.join(userId);
      const unreadCount = await chatController.getTotalUnreadCount(userId);
      socket.emit("unreadMessageCount", { count: unreadCount });
      logger.info(`Socket ${socket.id} joined user room: ${userId}`);
    } else {
      logger.warn(`Socket ${socket.id} connected without authentication`);
    }

    registerRoomHandlers(socket);
    registerChatHandlers(socket, io, chatController);
    registerMessageHandlers(socket, io, chatController);
    registerNotificationHandlers(socket, io, notificationController);

    socket.on("disconnect", (reason) => {
        logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });

    socket.on("error", (error) => {
        logger.error(`Socket error for ${socket.id}`, error);
    });
  });
}

export function getSocketIOInstance() {
  return ioInstance;
} 



