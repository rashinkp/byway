import { Server as SocketIOServer, Socket } from "socket.io";

export function socketHandler(
  handler: (data: any, socket: Socket, io: SocketIOServer) => Promise<any>,
  emitEvent?: string,
  io?: SocketIOServer
) {
  return async function (this: Socket, data: any) {
    try {
      const result = await handler(data, this, io!);
      if (emitEvent && result !== undefined) {
        if (emitEvent === 'broadcast') {
          io!.to(data.chatId).emit("message", result);
        } else {
          this.emit(emitEvent, result);
        }
      }
    } catch (err: any) {
      this.emit("error", { message: err.message || "Operation failed" });
    }
  };
} 