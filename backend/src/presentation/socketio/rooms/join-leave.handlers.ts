import { Socket } from 'socket.io';

export function registerRoomHandlers(socket: Socket) {
  socket.on('join', (roomId: string) => {
    const socketId = socket.id;
    const userId = socket.data.user?.id;
    
    console.log(`🚪 Socket joining room: ${roomId}`, {
      socketId,
      userId,
      roomId,
      timestamp: new Date().toISOString(),
    });
    
    socket.join(roomId);
    
    console.log(`✅ Socket successfully joined room: ${roomId}`, {
      socketId,
      userId,
      roomId,
      socketRooms: Array.from(socket.rooms),
    });
  });

  socket.on('leave', (roomId: string) => {
    const socketId = socket.id;
    const userId = socket.data.user?.id;
    
    console.log(`🚪 Socket leaving room: ${roomId}`, {
      socketId,
      userId,
      roomId,
      timestamp: new Date().toISOString(),
    });
    
    socket.leave(roomId);
    
    console.log(`✅ Socket successfully left room: ${roomId}`, {
      socketId,
      userId,
      roomId,
      socketRooms: Array.from(socket.rooms),
    });
  });
} 