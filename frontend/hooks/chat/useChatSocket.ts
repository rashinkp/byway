import { useEffect, useCallback } from 'react';
import socket from '@/lib/socket';

export function useChatSocket() {
  // Listen for incoming messages
  const onMessage = useCallback((handler: (msg: any) => void) => {
    socket.on('message', handler);
    return () => socket.off('message', handler);
  }, []);

  // Listen for errors
  const onError = useCallback((handler: (err: any) => void) => {
    socket.on('error', handler);
    return () => socket.off('error', handler);
  }, []);

  // Expose emitters and listeners
  return {
    joinChat: (chatId: string) => socket.emit('join', chatId),
    sendMessage: (data: any) => socket.emit('newMessage', data),
    createChat: (data: any) => socket.emit('createChat', data),
    getChatHistory: (data: any) => socket.emit('getChatHistory', data),
    listUserChats: (data: any) => socket.emit('listUserChats', data),
    getMessagesByChat: (data: any) => socket.emit('getMessagesByChat', data),
    getMessageById: (data: any) => socket.emit('getMessageById', data),
    deleteMessage: (data: any) => socket.emit('deleteMessage', data),
    onMessage,
    onError,
  };
} 