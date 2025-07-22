import { Socket, Server as SocketIOServer } from "socket.io";
import { socketHandler } from "../socket.utils";
import { ChatController } from "../../http/controllers/chat.controller";

export function registerMessageHandlers(
  socket: Socket,
  io: SocketIOServer,
  chatController: ChatController
) {
  socket.on(
    "getMessagesByChat",
    socketHandler(async (data) => {
      const messages = await chatController.getMessagesByChat({
        query: data,
      } as any);
      return messages;
    }, "messagesByChat")
  );

  socket.on(
    "getMessageById",
    socketHandler(async (data) => {
      const message = await chatController.getMessageById({
        params: data,
      } as any);
      return message;
    }, "messageById")
  );

  socket.on(
    "deleteMessage",
    socketHandler(async (data) => {
      try {
        console.log("[SocketIO] deleteMessage event received:", data);

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
        } as any);

        if (!deletionResult) {
          throw new Error("Failed to delete message");
        }

        // After successful deletion, notify participants
        const participants = await chatController.getChatParticipantsById(
          data.chatId
        );
        if (participants) {
          console.log(
            "[SocketIO] Emitting chatListUpdated after deleteMessage to:",
            participants.user1Id,
            participants.user2Id
          );

          // Emit to chat room first
          io.to(data.chatId).emit("messageDeleted", {
            messageId: data.messageId,
            chatId: data.chatId,
          });

          // Update chat lists for both participants
          io.to(participants.user1Id).emit("chatListUpdated");
          io.to(participants.user2Id).emit("chatListUpdated");
        } else {
          console.log(
            "[SocketIO] No participants found for chat:",
            data.chatId
          );
        }

        return {
          success: true,
          messageId: data.messageId,
          chatId: data.chatId,
        };
      } catch (error) {
        console.error("[SocketIO] Error in deleteMessage:", error);
        // Throw error to be handled by socketHandler wrapper
        throw error;
      }
    }, "messageDeleted")
  );

  // Handle when user joins a chat (to clear pending notifications)
  socket.on("joinChat", async ({ chatId }) => {
    try {
      const userId = socket.data.user?.id;
      if (userId && chatId) {
        // Join the chat room
        socket.join(chatId);

        // Mark all messages as read for this user in this chat
        await chatController.markMessagesAsRead({ chatId, userId });

        // Emit updated unread count to the user
        const unreadCount = await chatController.getTotalUnreadCount(userId);
        io.to(userId).emit("unreadMessageCount", { count: unreadCount });
        console.log("unread message count ----------> ", unreadCount);

        // Emit updated chat list to the user
        io.to(userId).emit("chatListUpdated");

        // Emit messagesRead event to the user
        console.log(
          "[SocketIO] Emitting messagesRead to user:",
          userId,
          "for chat:",
          chatId
        );
        io.to(userId).emit("messagesRead", { chatId, userId });
        // Also notify all participants in the chat room
        io.to(chatId).emit("messagesRead", { chatId, userId });

        console.log(
          `[SocketIO] User ${userId} joined chat ${chatId} and messages marked as read`
        );
      }
    } catch (err) {
      console.log("[SocketIO] Error in joinChat:", err);
    }
  });

  // Handle marking messages as read
  socket.on("markMessagesAsRead", async ({ chatId, userId }) => {
    try {
      const authenticatedUserId = socket.data.user?.id;
      if (!authenticatedUserId || authenticatedUserId !== userId) {
        socket.emit("error", {
          message: "Not authorized to mark messages as read",
        });
        return;
      }

      await chatController.markMessagesAsRead({ chatId, userId });

      // Emit updated unread count to the user
      const unreadCount = await chatController.getTotalUnreadCount(userId);
      io.to(userId).emit("unreadMessageCount", { count: unreadCount });

      // Emit chatListUpdated to update the chat list UI
      io.to(userId).emit("chatListUpdated");

      // Emit messagesRead event to all participants in the chat
      io.to(chatId).emit("messagesRead", { chatId, userId });

      console.log(
        `[SocketIO] Messages marked as read for user ${userId} in chat ${chatId}`
      );
    } catch (err) {
      console.error("[SocketIO] Error marking messages as read:", err);
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  });

  socket.on(
    "sendMessage",
    async ({ chatId, userId, content, imageUrl, audioUrl }) => {
      try {
        console.log("[SocketIO] sendMessage event received:", {
          chatId,
          userId,
          content,
          imageUrl,
          audioUrl,
        });
        const senderId = socket.data.user?.id;
        console.log("[SocketIO] senderId:", senderId);
        if (!senderId) {
          console.log("[SocketIO] No senderId, emitting error");
          socket.emit("error", {
            message: "Authentication required to send messages.",
          });
          return;
        }
        const message = await chatController.handleNewMessage({
          chatId,
          userId,
          senderId,
          content,
          imageUrl,
          audioUrl,
        });
        console.log(
          "[SocketIO] message result from handleNewMessage:",
          message
        );
        if (!message) {
          console.log("[SocketIO] No message returned, emitting error");
          socket.emit("error", { message: "Failed to send message." });
          return;
        }
        const effectiveChatId = message.chatId;
        if (!chatId && effectiveChatId) {
          socket.join(effectiveChatId);
        }
        socket.emit("messageSent", message);
        socket.emit("message", message);
        io.to(effectiveChatId || chatId).emit("message", message);

        // Note: Real-time notifications are now handled by the batching service
        // which will send them after a delay to prevent overwhelming the user

        // Emit chatListUpdated to both users in the chat using controller
        const participants = await chatController.getChatParticipantsById(
          effectiveChatId || chatId
        );
        if (participants) {
          console.log(
            "[SocketIO] Emitting chatListUpdated after sendMessage to:",
            participants.user1Id,
            participants.user2Id
          );
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
        console.log("[SocketIO] Caught error in sendMessage:", err);
        socket.emit("error", { message: "Failed to send message." });
      }
    }
  );
}
