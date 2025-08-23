export interface GetMessagesByChatData {
  chatId: string;
  limit?: number;
  beforeMessageId?: string;
}

export interface GetMessageByIdData {
  messageId: string;
}

export interface DeleteMessageData {
  messageId: string;
  chatId: string;
}

export interface JoinChatData {
  chatId: string;
}

export interface MarkMessagesAsReadData {
  chatId: string;
  userId: string;
}

export interface SendMessageData {
  chatId?: string; // Optional - backend can create chat if not provided
  userId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface ChatData {
  chatId: string;
  limit?: number;
  beforeMessageId?: string;
}
