import { z } from "zod";

export const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
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