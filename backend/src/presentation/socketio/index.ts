import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "./socket.auth";
import { registerChatHandlers } from "./handlers/chat.handlers";
import { registerMessageHandlers } from "./handlers/message.handlers";
import { registerRoomHandlers } from "./rooms/join-leave.handlers";
import { ChatController } from "../http/controllers/chat.controller";
import { WinstonLogger } from "../../infra/providers/logging/winston.logger";

export function setupSocketIO(server: HTTPServer, logger: WinstonLogger, chatController: ChatController) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    // Register modular handlers
    registerRoomHandlers(socket, io);
    registerChatHandlers(socket, io, chatController);
    registerMessageHandlers(socket, io, chatController);

    socket.on("disconnect", () => {
      // No logs here
    });
  });
} 