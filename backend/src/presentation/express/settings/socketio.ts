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
      logger.info(`User ${socket.id} joining chat ${chatId}`);
      console.log(`[SocketIO] User ${socket.id} joining chat ${chatId}`);
      socket.join(chatId);
      logger.info(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("newMessage", socketHandler(async (data, socket, io) => {
      logger.info(`New message request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] New message request from ${socket.id}:`, data);
      console.log(`[SocketIO] Socket data user:`, socket.data.user);
      
      if (!socket.data.user) {
        logger.warn(`Unauthorized message attempt from ${socket.id}`);
        console.log(`[SocketIO] Unauthorized message attempt from ${socket.id}`);
        socket.emit("error", { message: "Authentication required to send messages." });
        return;
      }
      
      // Get sender ID from JWT token
      const senderId = socket.data.user.id;
      console.log(`[SocketIO] Sending message from user ID:`, senderId);
      
      const messageData = {
        ...data,
        senderId
      };
      
      console.log(`[SocketIO] Final message data:`, messageData);
      
      const message = await chatController.handleNewMessage(messageData);
      logger.info(`Message sent successfully: ${JSON.stringify(message)}`);
      console.log(`[SocketIO] Message sent successfully:`, message);
      return message;
    }, 'broadcast'));

    socket.on("createChat", socketHandler(async (data) => {
      logger.info(`Create chat request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] Create chat request from ${socket.id}:`, data);
      
        const chat = await chatController.handleCreateChat(data);
      logger.info(`Chat created successfully: ${JSON.stringify(chat)}`);
      console.log(`[SocketIO] Chat created successfully:`, chat);
      return chat;
    }, "chatCreated"));

    socket.on("getChatHistory", socketHandler(async (data) => {
      logger.info(`Get chat history request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] Get chat history request from ${socket.id}:`, data);
      
        const chat = await chatController.getChatHistory({ query: data } as any);
      logger.info(`Chat history retrieved: ${JSON.stringify(chat)}`);
      console.log(`[SocketIO] Chat history retrieved:`, chat);
      return chat;
    }, "chatHistory"));

    socket.on("listUserChats", socketHandler(async (data, socket) => {
      logger.info(`List user chats request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] List user chats request from ${socket.id}:`, data);
      console.log(`[SocketIO] Socket data user:`, socket.data.user);
      
      // Get user ID from socket data (JWT token)
      if (!socket.data.user) {
        logger.warn(`Unauthorized chat list request from ${socket.id}`);
        console.log(`[SocketIO] Unauthorized chat list request from ${socket.id}`);
        socket.emit("error", { message: "Authentication required to list chats." });
        return;
      }
      
      const userId = socket.data.user.id;
      const page = data.page || 1;
      const limit = data.limit || 10;
      
      console.log(`[SocketIO] Getting chats for user ID:`, userId, 'page:', page, 'limit:', limit);
      
      const result = await chatController.listUserChats({ 
        query: { 
          userId,
          page,
          limit
        } 
      } as any);
      
      logger.info(`User chats retrieved: ${JSON.stringify(result)}`);
      console.log(`[SocketIO] User chats retrieved:`, result);
      return result;
    }, "userChats"));

    socket.on("getMessagesByChat", socketHandler(async (data) => {
      logger.info(`Get messages by chat request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] Get messages by chat request from ${socket.id}:`, data);
      
        const messages = await chatController.getMessagesByChat({ query: data } as any);
      logger.info(`Messages retrieved: ${JSON.stringify(messages)}`);
      console.log(`[SocketIO] Messages retrieved:`, messages);
      return messages;
    }, "messagesByChat"));

    socket.on("getMessageById", socketHandler(async (data) => {
      logger.info(`Get message by ID request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] Get message by ID request from ${socket.id}:`, data);
      
        const message = await chatController.getMessageById({ params: data } as any);
      logger.info(`Message retrieved: ${JSON.stringify(message)}`);
      console.log(`[SocketIO] Message retrieved:`, message);
      return message;
    }, "messageById"));

    socket.on("deleteMessage", socketHandler(async (data) => {
      logger.info(`Delete message request from ${socket.id}: ${JSON.stringify(data)}`);
      console.log(`[SocketIO] Delete message request from ${socket.id}:`, data);
      
        await chatController.deleteMessage({ params: data } as any);
      logger.info(`Message deleted successfully`);
      console.log(`[SocketIO] Message deleted successfully`);
      return { messageId: data.messageId };
    }, "messageDeleted"));

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      console.log("Socket disconnected: ", socket.id);
    });
  });
} 