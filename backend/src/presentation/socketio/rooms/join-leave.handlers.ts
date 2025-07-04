import { Socket } from 'socket.io';

export function registerRoomHandlers(socket: Socket) {
  socket.on('join', (roomId: string) => {
    socket.join(roomId);
  });

  socket.on('leave', (roomId: string) => {
    socket.leave(roomId);
  });
} 