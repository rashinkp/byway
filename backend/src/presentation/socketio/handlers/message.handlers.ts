import { Socket, Server as SocketIOServer } from "socket.io";
import { socketHandler } from "../socket.utils";
import { ChatController } from "../../http/controllers/chat.controller";
import { 
  GetMessagesByChatData, 
  GetMessageByIdData, 
  DeleteMessageData,
  JoinChatData,
  MarkMessagesAsReadData,
  SendMessageData
} from "../types/socket-data.types";

export function registerMessageHandlers(
  socket: Socket,
  io: SocketIOServer,
  chatController: ChatController
) {
  socket.on(
    "getMessagesByChat",
    socketHandler<GetMessagesByChatData>(async (data) => {
      const query: Record<string, string | number | boolean> = {
        chatId: data.chatId,
        limit: data.limit ?? 20,
      };

      if (data.beforeMessageId !== undefined) {
        query.beforeMessageId = data.beforeMessageId;
      }

      const messages = await chatController.getMessagesByChat({
        query,
        params: {},
      });
      
      // Extract the data from the controller response
      // The controller returns { statusCode: 200, body: { success: true, message: "Success", data: result, message: "Messages retrieved successfully" } }
      const messageData = (messages.body as any)?.data;
      
      console.log("🔍 getMessagesByChat result:", {
        hasResult: !!messages,
        resultType: typeof messages,
        hasBody: !!messages?.body,
        bodyType: typeof messages?.body,
        messageCount: Array.isArray(messageData) ? messageData.length : 'not array',
        timestamp: new Date().toISOString(),
      });
      
      return messageData || [];
    }, "messagesByChat")
  );

  socket.on(
    "getMessageById",
    socketHandler<GetMessageByIdData>(async (data) => {
      const message = await chatController.getMessageById({
        params: {messageId:data.messageId},
      });
      
      // Extract the data from the controller response
      // The controller returns { statusCode: 200, body: { success: true, message: "Success", data: result, message: "Message retrieved successfully" } }
      const messageData = (message.body as any)?.data;
      
      console.log("🔍 getMessageById result:", {
        hasResult: !!message,
        resultType: typeof message,
        hasBody: !!message?.body,
        bodyType: typeof message?.body,
        hasData: !!messageData,
        timestamp: new Date().toISOString(),
      });
      
      return messageData || null;
    }, "messageById")
  );

  socket.on(
    "deleteMessage",
    socketHandler<DeleteMessageData>(async (data) => {
      try {

        // Validate required data
        if (!data || !data.messageId || !data.chatId) {
          throw new Error("Missing required message data for deletion");
        }

        // Get the user ID from socket data for authorization
        const userId = socket.data.user?.id;
        if (!userId) {
          throw new Error("User not authorized to delete messages");
        }

        // Delete the message and get deletion status
        const deletionResult = await chatController.deleteMessage({
          params: {
            ...data,
            userId, // Pass userId for authorization check
          },
        });

        if (!deletionResult) {
          throw new Error("Failed to delete message");
        }

        // After successful deletion, notify participants
        const participants = await chatController.getChatParticipantsById(
          data.chatId
        );
        if (participants) {

          // Emit to chat room first
          io.to(data.chatId).emit("messageDeleted", {
            messageId: data.messageId,
            chatId: data.chatId,
          });

          // Update chat lists for both participants
          io.to(participants.user1Id).emit("chatListUpdated");
          io.to(participants.user2Id).emit("chatListUpdated");
        } else {
        }

        return {
          success: true,
          messageId: data.messageId,
          chatId: data.chatId,
        };
      } catch (error) {
        throw error;
      }
    }, "messageDeleted")
  );

  // Handle when user joins a chat (to clear pending notifications)
  socket.on("joinChat", async (data: JoinChatData) => {
      const userId = socket.data.user?.id;
      console.log(`🚪 [Backend] User ${userId} attempting to join chat: ${data.chatId}`, {
        userId,
        chatId: data.chatId,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
      
      if (userId && data.chatId) {
        // Join the chat room
        socket.join(data.chatId);
        console.log(`✅ [Backend] User ${userId} joined chat room: ${data.chatId}`, {
          userId,
          chatId: data.chatId,
          socketId: socket.id,
          socketRooms: Array.from(socket.rooms),
          timestamp: new Date().toISOString(),
        });

        // Mark all messages as read for this user in this chat
        await chatController.markMessagesAsRead({ chatId: data.chatId, userId });

        // Emit updated unread count to the user
        const unreadCount = await chatController.getTotalUnreadCount(userId);
        io.to(userId).emit("unreadMessageCount", { count: unreadCount });

        // Emit updated chat list to the user
        io.to(userId).emit("chatListUpdated");
        io.to(userId).emit("messagesRead", { chatId: data.chatId, userId });
        // Also notify all participants in the chat room
        io.to(data.chatId).emit("messagesRead", { chatId: data.chatId, userId });
        
        console.log(`📤 [Backend] Emitted messagesRead event for chat: ${data.chatId}`, {
          userId,
          chatId: data.chatId,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log(`❌ [Backend] Failed to join chat - missing userId or chatId`, {
          userId,
          chatId: data.chatId,
          timestamp: new Date().toISOString(),
        });
      }
   
  });

  // Handle marking messages as read
  socket.on("markMessagesAsRead", async (data: MarkMessagesAsReadData) => {
    try {
      const authenticatedUserId = socket.data.user?.id;
      if (!authenticatedUserId || authenticatedUserId !== data.userId) {
        socket.emit("error", {
          message: "Not authorized to mark messages as read",
        });
        return;
      }

      await chatController.markMessagesAsRead({ chatId: data.chatId, userId: data.userId });

      // Emit updated unread count to the user
      const unreadCount = await chatController.getTotalUnreadCount(data.userId);
      io.to(data.userId).emit("unreadMessageCount", { count: unreadCount });

      // Emit chatListUpdated to update the chat list UI
      io.to(data.userId).emit("chatListUpdated");

      // Emit messagesRead event to all participants in the chat
      io.to(data.chatId).emit("messagesRead", { chatId: data.chatId, userId: data.userId });


    } catch {
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  });

  // Handle newMessage event (frontend emits this)
  socket.on(
    "newMessage",
    async (data: SendMessageData) => {
      try {
        const senderId = socket.data.user?.id;
        if (!senderId) {
          socket.emit("error", {
            message: "Authentication required to send messages.",
          });
          return;
        }

        // Validate required fields
        if (!data.chatId) {
          socket.emit("error", { message: "Chat ID is required." });
          return;
        }

        if (!data.content && !data.imageUrl && !data.audioUrl) {
          socket.emit("error", { message: "Message content, image, or audio is required." });
          return;
        }

        const message = await chatController.handleNewMessage({
          chatId: data.chatId,
          userId: data.userId || senderId, // Use senderId as fallback
          senderId,
          content: data.content,
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
        });

        if (!message) {
          socket.emit("error", { message: "Failed to send message." });
          return;
        }

        // Join the chat room if not already joined
        socket.join(data.chatId);
        
        // Emit success response
        socket.emit("messageSent", message);
        
        // Broadcast to all participants in the chat
        io.to(data.chatId).emit("message", message);

        // Update chat list for all participants
        const participants = await chatController.getChatParticipantsById(data.chatId);
        if (participants) {
          io.to(participants.user1Id).emit("chatListUpdated");
          io.to(participants.user2Id).emit("chatListUpdated");
          
          // Update unread count for recipient
          const recipientId = participants.user1Id === senderId ? participants.user2Id : participants.user1Id;
          const unreadCount = await chatController.getTotalUnreadCount(recipientId);
          io.to(recipientId).emit("unreadMessageCount", { count: unreadCount });
        }
      } catch (err) {
        console.error("❌ newMessage handler error:", err);
        socket.emit("error", { message: "Failed to send message." });
      }
    }
  );

  socket.on(
    "sendMessage",
    async (data: SendMessageData) => {
      try {
        const senderId = socket.data.user?.id;
        console.log(`📥 [Backend] Received sendMessage event:`, {
          senderId,
          chatId: data.chatId,
          userId: data.userId,
          content: data.content?.substring(0, 50) + '...',
          timestamp: new Date().toISOString(),
        });
        
        if (!senderId) {
          socket.emit("error", {
            message: "Authentication required to send messages.",
          });
          return;
        }
        console.log(`🔍 [Backend] Calling handleNewMessage with:`, {
          chatId: data.chatId,
          userId: data.userId,
          senderId,
          content: data.content?.substring(0, 50) + '...',
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
          timestamp: new Date().toISOString(),
        });
        
        // Handle the case where chatId is undefined (new chat)
        const messageData = {
          userId: data.userId,
          senderId,
          content: data.content,
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
        };
        
        // Only include chatId if it's not undefined
        if (data.chatId !== undefined) {
          (messageData as any).chatId = data.chatId;
        }
        
        const message = await chatController.handleNewMessage(messageData);
        
        console.log(`🔍 [Backend] handleNewMessage result:`, {
          hasMessage: !!message,
          messageId: message?.id,
          chatId: message?.chatId,
          timestamp: new Date().toISOString(),
        });
        
        console.log(`🔍 [Backend] Full message result from controller:`, message);
        console.log(`🔍 [Backend] Message type:`, typeof message);
        console.log(`🔍 [Backend] Message keys:`, message ? Object.keys(message) : []);
        if (!message) {
          socket.emit("error", { message: "Failed to send message." });
          return;
        }


        
        const effectiveChatId: string = message.chatId;
        
        const targetChatId = effectiveChatId || data.chatId; 

        if (!targetChatId) {
          socket.emit("error", { message: "Chat ID is missing." });
          return;
        }

        if (!data.chatId && effectiveChatId) {
          socket.join(effectiveChatId);
        }
        console.log(`📤 [Backend] Emitting message to sender: ${senderId}`, {
          messageId: message.id,
          chatId: targetChatId,
          timestamp: new Date().toISOString(),
        });
        socket.emit("messageSent", message);
        socket.emit("message", message);
        
        console.log(`📤 [Backend] Broadcasting message to chat room: ${targetChatId}`, {
          messageId: message.id,
          chatId: targetChatId,
          timestamp: new Date().toISOString(),
        });
        io.to(targetChatId).emit("message", message);

        // Note: Real-time notifications are now handled by the batching service
        // which will send them after a delay to prevent overwhelming the user

        // Emit chatListUpdated to both users in the chat using controller
        const participants = await chatController.getChatParticipantsById(
          targetChatId
        );
        if (participants) {
    
          io.to(participants.user1Id).emit("chatListUpdated");
          io.to(participants.user2Id).emit("chatListUpdated");
          // Emit unreadMessageCount to the recipient
          const recipientId =
            participants.user1Id === senderId
              ? participants.user2Id
              : participants.user1Id;
          const unreadCount = await chatController.getTotalUnreadCount(
            recipientId
          );
          io.to(recipientId).emit("unreadMessageCount", { count: unreadCount });
        }
      } catch (err) {
        socket.emit("error", { message: "Failed to send message." });
      }
    }
  );
}
