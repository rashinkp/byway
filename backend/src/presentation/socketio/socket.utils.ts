import { Socket, Server as SocketIOServer } from "socket.io";

// Type for data that has a chatId property
interface ChatData {
  chatId: string;
}

export function socketHandler<TData = unknown, TResult = unknown>(
  handler: (data: TData, socket: Socket, io: SocketIOServer) => Promise<TResult>,
  emitEvent?: string,
  io?: SocketIOServer
) {
  return async function (this: Socket, data: TData) {
    const socketId = this.id;
    const userId = this.data.user?.id;
    const eventName = String(this.eventNames()[this.eventNames().length - 1] || 'unknown');
    
    console.log(`🔄 Socket handler called: ${eventName}`, {
      socketId,
      userId,
      emitEvent,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log(`⚡ Executing handler for event: ${eventName}`, {
        socketId,
        userId,
        data: JSON.stringify(data),
      });

      const result = await handler(data, this, io!);
      
      console.log(`✅ Handler completed successfully: ${eventName}`, {
        socketId,
        userId,
        hasResult: result !== undefined,
        resultType: typeof result,
      });

      if (emitEvent && result !== undefined) {
        if (emitEvent === 'broadcast') {
          // Type guard to check if data has chatId property
          const chatData = data as ChatData;
          if (chatData.chatId) {
            console.log(`📢 Broadcasting to chat room: ${chatData.chatId}`, {
              socketId,
              userId,
              event: 'message',
            });
            io!.to(chatData.chatId).emit("message", result);
          } else {
            console.warn(`⚠️ No chatId found for broadcast event: ${eventName}`, {
              socketId,
              userId,
            });
          }
        } else {
          console.log(`📤 Emitting event: ${emitEvent}`, {
            socketId,
            userId,
            event: emitEvent,
          });
          this.emit(emitEvent, result);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      console.error(`❌ Socket handler error: ${eventName}`, {
        socketId,
        userId,
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      this.emit("error", { message: errorMessage });
    }
  };
} 