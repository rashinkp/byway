import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { WinstonLogger } from "../../../infra/providers/logging/winston.logger";
import { ChatController } from "../../http/controllers/chat.controller";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { socketAuthMiddleware } from "./socket.auth";
import { socketHandler } from "./socket.utils";

export function setupSocketIO(server: HTTPServer, logger: WinstonLogger, chatController: ChatController) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    console.log("Socket connected: ", socket.id);

    socket.on("join", (chatId) => {
      socket.join(chatId);
      logger.info(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("newMessage", socketHandler(async (data, socket, io) => {
      const message = await chatController.handleNewMessage(data);
      return message;
    }, 'broadcast'));

    socket.on("createChat", socketHandler(async (data) => {
      const chat = await chatController.handleCreateChat(data);
      return chat;
    }, "chatCreated"));

    socket.on("getChatHistory", socketHandler(async (data) => {
      const chat = await chatController.getChatHistory({ query: data } as any);
      return chat;
    }, "chatHistory"));

    socket.on("listUserChats", socketHandler(async (data) => {
      const chats = await chatController.listUserChats({ query: data } as any);
      return chats;
    }, "userChats"));

    socket.on("getMessagesByChat", socketHandler(async (data) => {
      const messages = await chatController.getMessagesByChat({ query: data } as any);
      return messages;
    }, "messagesByChat"));

    socket.on("getMessageById", socketHandler(async (data) => {
      const message = await chatController.getMessageById({ params: data } as any);
      return message;
    }, "messageById"));

    socket.on("deleteMessage", socketHandler(async (data) => {
      await chatController.deleteMessage({ params: data } as any);
      return { messageId: data.messageId };
    }, "messageDeleted"));

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      console.log("Socket disconnected: ", socket.id);
    });
  });
} 