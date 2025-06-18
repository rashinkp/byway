import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { WinstonLogger } from "../../../infra/providers/logging/winston.logger";
import { ChatController } from "../../http/controllers/chat.controller";
import { socketAuthMiddleware } from "./socket.auth";
import { socketHandler } from "./socket.utils";

export function setupSocketIO(server: HTTPServer, logger: WinstonLogger, chatController: ChatController) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("join", (chatId) => {
      socket.join(chatId);
    });

    socket.on("createChat", socketHandler(async (data) => {
      
        const chat = await chatController.handleCreateChat(data);
      return chat;
    }, "chatCreated"));

    socket.on("getChatHistory", socketHandler(async (data) => {
      
        const chat = await chatController.getChatHistory({ query: data } as any);
      return chat;
    }, "chatHistory"));

    socket.on("listUserChats", socketHandler(async (data, socket) => {
      if (!socket.data.user) {
        socket.emit("error", { message: "Authentication required to list chats." });
        return;
      }
      const userId = socket.data.user.id;
      const page = data.page || 1;
      const limit = data.limit || 10;
      const result = await chatController.listUserChats({ 
        query: { 
          userId,
          page,
          limit
        } 
      } as any);
      return result;
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

    socket.on("sendMessage", async ({ chatId, userId, content }) => {
      try {
        console.log('[SocketIO] sendMessage event received:', { chatId, userId, content });
        const senderId = socket.data.user?.id;
        console.log('[SocketIO] senderId:', senderId);
        if (!senderId) {
          console.log('[SocketIO] No senderId, emitting error');
          socket.emit('error', { message: 'Authentication required to send messages.' });
          return;
        }
        const message = await chatController.handleNewMessage({ chatId, userId, senderId, content });
        console.log('[SocketIO] message result from handleNewMessage:', message);
        if (!message) {
          console.log('[SocketIO] No message returned, emitting error');
          socket.emit('error', { message: 'Failed to send message.' });
          return;
        }
        const effectiveChatId = message.chatId;
        if (!chatId && effectiveChatId) {
          socket.join(effectiveChatId);
        }
        socket.emit('messageSent', message);
        socket.emit('message', message);
        io.to(effectiveChatId || chatId).emit('message', message);
      } catch (err) {
        console.log('[SocketIO] Caught error in sendMessage:', err);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    socket.on("disconnect", () => {
        // No logs here
    });
  });
} 