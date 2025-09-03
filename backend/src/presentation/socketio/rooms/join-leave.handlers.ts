import { Socket } from 'socket.io';

export function registerRoomHandlers(socket: Socket) {
  socket.on('join', (roomId: string) => {
    console.log(`[backend] socket ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on('leave', (roomId: string) => {
    console.log(`[backend] socket ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);
  });

  // Accept object-based join payloads for compatibility with some clients
  socket.on('joinChat', (data: { chatId?: string } | undefined) => {
    const chatId = data?.chatId;
    if (typeof chatId === 'string' && chatId.length > 0) {
      console.log(`[backend] socket ${socket.id} joining chat room: ${chatId}`);
      socket.join(chatId);
    }
  });
} 