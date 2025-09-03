import { z } from "zod";

export const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  content: z.string().min(1),
});

// Schema for socket messages where senderId comes from JWT
export const sendMessageSocketSchema = z.object({
  chatId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
}).refine((data) => {
  // Allow if chatId exists and is not empty, or if userId exists and is not empty
  return (data.chatId && data.chatId.trim() !== '') || (data.userId && data.userId.trim() !== '');
}, {
  message: 'Either chatId or userId is required and must not be empty',
  path: ['chatId'],
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
  search: z.string().optional(),
  sort: z.string().optional(),
  filter: z.string().optional(),
});

export const getMessagesByChatSchema = z.object({
  chatId: z.string(),
  limit: z.coerce.number().optional(),
  beforeMessageId: z.string().optional(),
});

export const getMessageByIdSchema = z.object({
  messageId: z.string().min(1),
});

export const deleteMessageSchema = z.object({
  messageId: z.string().min(1),
}); 