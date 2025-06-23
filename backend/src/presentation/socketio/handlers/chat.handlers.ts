import { Socket, Server as SocketIOServer } from 'socket.io';
import { socketHandler } from '../socket.utils';
import { ChatController } from '../../http/controllers/chat.controller';

export function registerChatHandlers(socket: Socket, io: SocketIOServer, chatController: ChatController) {
  socket.on('createChat', socketHandler(async (data) => {
    const chat = await chatController.handleCreateChat(data);
    return chat;
  }, 'chatCreated'));

  socket.on('getChatHistory', socketHandler(async (data) => {
    const chat = await chatController.getChatHistory({ query: data } as any);
    return chat;
  }, 'chatHistory'));

  socket.on('listUserChats', socketHandler(async (data, socket) => {
    if (!socket.data.user) {
      socket.emit('error', { message: 'Authentication required to list chats.' });
      return;
    }
    const userId = socket.data.user.id;
    const page = data.page || 1;
    const limit = data.limit || 10;
    const search = data.search || undefined;
    const sort = data.sort || undefined;
    const filter = data.filter || undefined;
    const result = await chatController.listUserChats({
      query: {
        userId,
        page,
        limit,
        search,
        sort,
        filter
      }
    } as any);
    return result;
  }, 'userChats'));

  socket.on('getMessagesByChat', socketHandler(async (data) => {
    const chatId = data.chatId;
    const limit = data.limit || 20;
    const beforeMessageId = data.beforeMessageId || undefined;
    const messages = await chatController.getMessagesByChat({ query: { chatId, limit, beforeMessageId } } as any);
    return messages;
  }, 'messagesByChat'));
} 