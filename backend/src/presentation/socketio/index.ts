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
let ioInstance: SocketIOServer | null = null;

export function setupSocketIO(
  server: HTTPServer,
  logger: WinstonLogger,
  chatController: ChatController,
  notificationController: NotificationController,
) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
});
  ioInstance = io;

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    console.log("Socket connected: ", socket.id);

    const userId = socket.data.user?.id;
    console.log("[SocketIO] userId on connection:", userId);
    if (userId) {
      socket.join(userId);
      const unreadCount = await chatController.getTotalUnreadCount(userId);
      console.log('starting socket io total unread count')
      socket.emit("unreadMessageCount", { count: unreadCount });
      console.log('over socket io total unread count' , unreadCount)
    }

    // Register modular handlers
    registerRoomHandlers(socket);
    registerChatHandlers(socket, io, chatController);
    registerMessageHandlers(socket, io, chatController);
    registerNotificationHandlers(socket, io, notificationController);

    socket.on("disconnect", () => {
      // No logs here
    });
  });
}

export function getSocketIOInstance() {
  return ioInstance;
} 