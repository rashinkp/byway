import socket from '@/lib/socket';

export const joinChat = (chatId: string) => {
  socket.emit('joinChat', { chatId });
};

export const sendMessage = (
  data: { chatId?: string; content: string; userId?: string; imageUrl?: string; audioUrl?: string },
  onSuccess?: (message: any) => void,
  onError?: (error: any) => void
) => {
  if (!socket.connected) {
    console.warn('[SocketChat] Socket not connected, cannot send message');
    if (onError) onError({ message: 'Socket not connected' });
    return;
  }
  
  console.log('[SocketChat] Sending message with data:', data);
  socket.emit('sendMessage', data);
  
  if (onSuccess) {
    socket.once('messageSent', onSuccess);
  }
  
  if (onError) {
    socket.once('error', onError);
  }
};

export const createChat = (data: { user1Id: string; user2Id: string }, callback?: (chat: any) => void) => {
  socket.emit('createChat', data);
  if (callback) {
    socket.once('chatCreated', callback);
  }
};

export const getChatHistory = (data: any, callback: (history: any) => void) => {
  socket.emit('getChatHistory', data);
  socket.once('chatHistory', callback);
};

export const listUserChats = (
  data: { page?: number; limit?: number; search?: string; sort?: string; filter?: string } = {},
  callback: (result: any) => void
) => {
  if (!socket.connected) {
    return;
  }
  
  socket.emit('listUserChats', data);
  
  socket.once('userChats', (result: any) => {
    callback(result);
  });
};

export const getMessagesByChat = (data: any, callback: (messages: any) => void) => {
  socket.emit('getMessagesByChat', data);
  socket.once('messagesByChat', (messages: any) => {
    callback(messages);
  });
};

export const getMessageById = (data: any, callback: (message: any) => void) => {
  socket.emit('getMessageById', data);
  socket.once('messageById', callback);
};

export const deleteMessage = (data: any, callback?: (result: any) => void) => {
  socket.emit('deleteMessage', data);
  if (callback) {
    socket.once('messageDeleted', callback);
  }
};

export const createChatSocket = (data: { user1Id: string; user2Id: string }, callback?: (chat: any) => void) => {
  socket.emit('createChat', data);
  if (callback) {
    socket.once('chatCreated', callback);
  }
};

export const markMessagesAsRead = (chatId: string, userId: string) => {
  socket.emit('markMessagesAsRead', { chatId, userId });
}; 