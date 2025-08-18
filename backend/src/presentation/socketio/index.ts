import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "./socket.auth";
import { registerChatHandlers } from "./handlers/chat.handlers";
import { registerMessageHandlers } from "./handlers/message.handlers";
import { registerRoomHandlers } from "./rooms/join-leave.handlers";
import { registerNotificationHandlers } from "./handlers/notification.handlers";
import { ChatController } from "../http/controllers/chat.controller";
import { NotificationController } from '../http/controllers/notification.controller';
import { WinstonLogger } from "../../infra/providers/logging/winston.logger";
import { envConfig } from "../express/configs/env.config";
let ioInstance: SocketIOServer | null = null;

export function setupSocketIO(
  server: HTTPServer,
  logger: WinstonLogger,
  chatController: ChatController,
  notificationController: NotificationController,
) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: envConfig.CORS_ORIGIN,
      credentials: true,
    },
  });
  ioInstance = io;

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
     logger.info(`Socket connected: ${socket.id}`);

    const userId = socket.data.user?.id;
    if (userId) {
      socket.join(userId);
      const unreadCount = await chatController.getTotalUnreadCount(userId);
      socket.emit("unreadMessageCount", { count: unreadCount });
    }

    registerRoomHandlers(socket);
    registerChatHandlers(socket, io, chatController);
    registerMessageHandlers(socket, io, chatController);
    registerNotificationHandlers(socket, io, notificationController);

    socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
}

export function getSocketIOInstance() {
  return ioInstance;
} 



