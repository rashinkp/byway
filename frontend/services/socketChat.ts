import socket from '@/lib/socket';

export const joinChat = (chatId: string) => {
  console.log('[SocketService] Joining chat:', chatId);
  socket.emit('join', chatId);
};

export const sendMessage = (data: { chatId: string; content: string }, callback?: (message: any) => void) => {
  console.log('[SocketService] Sending message:', data);
  socket.emit('newMessage', data);
  if (callback) {
    socket.once('message', callback);
  }
};

export const createChat = (data: { user1Id: string; user2Id: string }, callback?: (chat: any) => void) => {
  console.log('[SocketService] Creating chat:', data);
  socket.emit('createChat', data);
  if (callback) {
    socket.once('chatCreated', callback);
  }
};

export const getChatHistory = (data: any, callback: (history: any) => void) => {
  console.log('[SocketService] Getting chat history:', data);
  socket.emit('getChatHistory', data);
  socket.once('chatHistory', callback);
};

export const listUserChats = (data: { page?: number; limit?: number } = {}, callback: (result: any) => void) => {
  console.log('[SocketService] Listing user chats for current user');
  console.log('[SocketService] Socket connected:', socket.connected);
  console.log('[SocketService] Socket ID:', socket.id);
  console.log('[SocketService] Pagination data:', data);
  
  if (!socket.connected) {
    console.error('[SocketService] Socket not connected, cannot fetch chats');
    return;
  }
  
  socket.emit('listUserChats', data);
  console.log('[SocketService] Emitted listUserChats event');
  
  socket.once('userChats', (result: any) => {
    console.log('[SocketService] Received user chats:', result);
    callback(result);
  });
  
  // Add error handling
  socket.once('error', (error: any) => {
    console.error('[SocketService] Error fetching chats:', error);
  });
};

export const getMessagesByChat = (data: any, callback: (messages: any) => void) => {
  console.log('[SocketService] Getting messages by chat:', data);
  socket.emit('getMessagesByChat', data);
  socket.once('messagesByChat', (messages: any) => {
    console.log('[SocketService] Received messages by chat:', messages);
    callback(messages);
  });
};

export const getMessageById = (data: any, callback: (message: any) => void) => {
  console.log('[SocketService] Getting message by ID:', data);
  socket.emit('getMessageById', data);
  socket.once('messageById', callback);
};

export const deleteMessage = (data: any, callback?: (result: any) => void) => {
  console.log('[SocketService] Deleting message:', data);
  socket.emit('deleteMessage', data);
  if (callback) {
    socket.once('messageDeleted', callback);
  }
}; 