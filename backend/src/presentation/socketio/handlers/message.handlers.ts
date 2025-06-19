import { Socket, Server as SocketIOServer } from 'socket.io';
import { socketHandler } from '../socket.utils';
import { ChatController } from '../../http/controllers/chat.controller';

export function registerMessageHandlers(socket: Socket, io: SocketIOServer, chatController: ChatController) {
  socket.on('getMessagesByChat', socketHandler(async (data) => {
    const messages = await chatController.getMessagesByChat({ query: data } as any);
    return messages;
  }, 'messagesByChat'));

  socket.on('getMessageById', socketHandler(async (data) => {
    const message = await chatController.getMessageById({ params: data } as any);
    return message;
  }, 'messageById'));

  socket.on('deleteMessage', socketHandler(async (data) => {
    await chatController.deleteMessage({ params: data } as any);
    // Emit chatListUpdated to both users in the chat using controller
    if (data && data.chatId) {
      const participants = await chatController.getChatParticipantsById(data.chatId);
      if (participants) {
        console.log('[SocketIO] Emitting chatListUpdated after deleteMessage to:', participants.user1Id, participants.user2Id);
        io.to(participants.user1Id).emit('chatListUpdated');
        io.to(participants.user2Id).emit('chatListUpdated');
      }
    }
    return { messageId: data.messageId };
  }, 'messageDeleted'));

  socket.on('sendMessage', async ({ chatId, userId, content }) => {
    try {
      console.log('[SocketIO] sendMessage event received:', { chatId, userId, content });
      const senderId = socket.data.user?.id;
      console.log('[SocketIO] senderId:', senderId);
      if (!senderId) {
        console.log('[SocketIO] No senderId, emitting error');
        socket.emit('error', { message: 'Authentication required to send messages.' });
        return;
      }
      const message = await chatController.handleNewMessage({ chatId, userId, senderId, content });
      console.log('[SocketIO] message result from handleNewMessage:', message);
      if (!message) {
        console.log('[SocketIO] No message returned, emitting error');
        socket.emit('error', { message: 'Failed to send message.' });
        return;
      }
      const effectiveChatId = message.chatId;
      if (!chatId && effectiveChatId) {
        socket.join(effectiveChatId);
      }
      socket.emit('messageSent', message);
      socket.emit('message', message);
      io.to(effectiveChatId || chatId).emit('message', message);
      // Emit chatListUpdated to both users in the chat using controller
      const participants = await chatController.getChatParticipantsById(effectiveChatId || chatId);
      if (participants) {
        console.log('[SocketIO] Emitting chatListUpdated after sendMessage to:', participants.user1Id, participants.user2Id);
        io.to(participants.user1Id).emit('chatListUpdated');
        io.to(participants.user2Id).emit('chatListUpdated');
      }
    } catch (err) {
      console.log('[SocketIO] Caught error in sendMessage:', err);
      socket.emit('error', { message: 'Failed to send message.' });
    }
  });
} 