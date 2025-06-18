import { Server as SocketIOServer, Socket } from "socket.io";

export function socketHandler(
  handler: (data: any, socket: Socket, io: SocketIOServer) => Promise<any>,
  emitEvent?: string,
  io?: SocketIOServer
) {
  return async function (this: Socket, data: any) {
    const socket = this;
    try {
      const result = await handler(data, socket, io!);
      if (emitEvent && result !== undefined) {
        if (emitEvent === 'broadcast') {
          io!.to(data.chatId).emit("message", result);
        } else {
          socket.emit(emitEvent, result);
        }
      }
    } catch (err: any) {
      socket.emit("error", { message: err.message || "Operation failed" });
    }
  };
} 