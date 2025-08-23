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
  logger.info("🔌 Setting up Socket.IO server...");
  
  const io = new SocketIOServer(server, {
    cors: {
      origin: envConfig.CORS_ORIGIN,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });
  
  ioInstance = io;

  // Log server setup
  logger.info(`🌐 Socket.IO server configured with CORS origin: ${envConfig.CORS_ORIGIN}`);
  logger.info(`📡 Socket.IO transports enabled: websocket, polling`);

  io.use(socketAuthMiddleware);

  // Log connection attempts
  io.engine.on("connection_error", (err) => {
    logger.error("❌ Socket.IO connection error:", {
      error: err.message,
      code: err.code,
      context: err.context,
      req: err.req?.headers,
    });
  });

  io.on("connection", async (socket) => {
    const connectionId = socket.id;
    const userAgent = socket.handshake.headers['user-agent'];
    const ip = socket.handshake.address;
    const userId = socket.data.user?.id;
    
    logger.info(`🔗 Socket connected: ${connectionId} - User: ${userId || 'anonymous'} - IP: ${ip} - UA: ${userAgent}`);

    // Log authentication status
    if (userId) {
      logger.info(`✅ Authenticated socket connection for user: ${userId} - Socket: ${connectionId} - Role: ${socket.data.user?.role}`);
      
      socket.join(userId);
      logger.info(`👥 User ${userId} joined their personal room`);
      
      try {
        const unreadCount = await chatController.getTotalUnreadCount(userId);
        socket.emit("unreadMessageCount", { count: unreadCount });
        logger.info(`📬 Sent unread message count to user ${userId}: ${unreadCount}`);
      } catch (error) {
        logger.error(`❌ Failed to get unread count for user ${userId}:`, error);
      }
    } else {
      logger.warn(`⚠️ Unauthenticated socket connection: ${connectionId} - IP: ${ip} - UA: ${userAgent}`);
    }

    // Log room join/leave events
    const originalJoin = socket.join;
    socket.join = function(room: string | string[]) {
      const rooms = Array.isArray(room) ? room : [room];
      logger.info(`🚪 Socket ${connectionId} joining rooms: ${rooms.join(', ')} - User: ${userId}`);
      return originalJoin.call(this, room);
    };

    const originalLeave = socket.leave;
    socket.leave = function(room: string) {
      logger.info(`🚪 Socket ${connectionId} leaving room: ${room} - User: ${userId}`);
      return originalLeave.call(this, room);
    };

    // Log emit events
    const originalEmit = socket.emit;
    socket.emit = function(event: string, ...args: any[]) {
      logger.debug(`📤 Socket ${connectionId} emitting event: ${event} - User: ${userId} - Args: ${args.length}`);
      return originalEmit.call(this, event, ...args);
    };

    // Log broadcast events
    const originalBroadcast = socket.broadcast;
    socket.broadcast.emit = function(event: string, ...args: any[]) {
      logger.debug(`📢 Socket ${connectionId} broadcasting event: ${event} - User: ${userId} - Args: ${args.length}`);
      return originalBroadcast.emit.call(this, event, ...args);
    };

    registerRoomHandlers(socket);
    registerChatHandlers(socket, io, chatController);
    registerMessageHandlers(socket, io, chatController);
    registerNotificationHandlers(socket, io, notificationController);

    // Log all incoming events
    socket.onAny((eventName, ...args) => {
      logger.debug(`📥 Socket ${connectionId} received event: ${eventName} - User: ${userId} - Args: ${args.length}`);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`🔌 Socket disconnected: ${connectionId} - User: ${userId} - Reason: ${reason}`);
    });

    socket.on("error", (error) => {
      logger.error(`❌ Socket error for ${connectionId} - User: ${userId} - Error: ${error.message}`);
    });
  });

  // Log server-wide events
  io.on("error", (error) => {
    logger.error("❌ Socket.IO server error:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  });

  logger.info("✅ Socket.IO server setup completed successfully");
}

export function getSocketIOInstance() {
  return ioInstance;
} 



