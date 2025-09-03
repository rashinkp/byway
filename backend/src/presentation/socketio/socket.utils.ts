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
    try {
      const result = await handler(data, this, io!);

      if (emitEvent && result !== undefined) {
        if (emitEvent === 'broadcast') {
          // Type guard to check if data has chatId property
          const chatData = data as ChatData;
          if (chatData.chatId) {
            io!.to(chatData.chatId).emit("message", result);
          }
        } else {
          this.emit(emitEvent, result);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      this.emit("error", { message: errorMessage });
    }
  };
} 