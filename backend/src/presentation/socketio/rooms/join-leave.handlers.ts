import { Socket, Server as SocketIOServer } from 'socket.io';

export function registerRoomHandlers(socket: Socket, io: SocketIOServer) {
  socket.on('join', (roomId: string) => {
    socket.join(roomId);
  });

  socket.on('leave', (roomId: string) => {
    socket.leave(roomId);
  });
} 