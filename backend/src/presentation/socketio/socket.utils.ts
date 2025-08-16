import { Server as SocketIOServer, Socket } from "socket.io";

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
          io!.to((data as any).chatId).emit("message", result);
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