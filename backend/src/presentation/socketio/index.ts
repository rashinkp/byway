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
  notificationController: NotificationController
) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });
  ioInstance = io;

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    // Join user to their own room for targeted notifications
    const userId = socket.data.user?.id;
    if (userId) {
      socket.join(userId);
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