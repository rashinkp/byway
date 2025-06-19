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

  // Handle when user joins a chat (to clear pending notifications)
  socket.on('joinChat', async ({ chatId }) => {
    try {
      const userId = socket.data.user?.id;
      if (userId && chatId) {
        // Join the chat room
        socket.join(chatId);
        
        // Clear any pending notifications for this user in this chat
        // This will be handled by the notification batching service
        console.log(`[SocketIO] User ${userId} joined chat ${chatId}`);
      }
    } catch (err) {
      console.log('[SocketIO] Error in joinChat:', err);
    }
  });

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
      
      // Note: Real-time notifications are now handled by the batching service
      // which will send them after a delay to prevent overwhelming the user
      
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