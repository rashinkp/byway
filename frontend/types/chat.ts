export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  type: 'text' | 'image' | 'audio';
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface Chat {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface ChatListItem {
  id: string;
  type: 'chat' | 'user';
  displayName: string;
  avatar?: string;
  role: string;
  lastMessage?: {
    content?: string;
    imageUrl?: string;
    audioUrl?: string;
    type: 'text' | 'image' | 'audio';
  };
  lastMessageTime?: string;
  unreadCount: number;
  chatId?: string;
  userId?: string;
  isOnline: boolean;
}

export interface ChatHistoryResponse {
  items: ChatListItem[];
  totalCount: number;
  hasMore: boolean;
  nextPage?: number;
}

export interface SendMessageData {
  chatId?: string;
  content: string;
  userId?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface CreateChatData {
  user1Id: string;
  user2Id: string;
}

export interface GetChatHistoryData {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: string;
}

export interface GetMessagesData {
  chatId: string;
  limit?: number;
  beforeMessageId?: string;
}

export interface GetMessageData {
  messageId: string;
}

export interface DeleteMessageData {
  messageId: string;
  chatId: string;
}

export interface MarkMessagesAsReadData {
  chatId: string;
  userId: string;
}
