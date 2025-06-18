import { z } from "zod";

export const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  content: z.string().min(1),
});

// Schema for socket messages where senderId comes from JWT
export const sendMessageSocketSchema = z.object({
  chatId: z.string().min(1),
  content: z.string().min(1),
});

export const createChatSchema = z.object({
  user1Id: z.string().min(1),
  user2Id: z.string().min(1),
});

export const getChatHistorySchema = z.object({
  user1Id: z.string().min(1),
  user2Id: z.string().min(1),
});

export const listUserChatsSchema = z.object({
  userId: z.string().min(1),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export const getMessagesByChatSchema = z.object({
  chatId: z.string().min(1),
});

export const getMessageByIdSchema = z.object({
  messageId: z.string().min(1),
});

export const deleteMessageSchema = z.object({
  messageId: z.string().min(1),
}); 