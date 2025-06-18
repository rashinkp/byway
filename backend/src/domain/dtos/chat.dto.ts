// DTO for message responses sent to frontend (minimal for one-to-one chat)
export interface MessageResponseDTO {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

// Enhanced chat list item for frontend display
export class EnhancedChatListItemDTO {
  id!: string;
  type!: 'chat' | 'user'; // 'chat' for existing chats, 'user' for other users
  displayName!: string;
  avatar?: string;
  role!: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  userId?: string; // For user items, this is the other user's ID
  chatId?: string; // For chat items, this is the chat ID
  isOnline?: boolean;
}

// Paginated chat list response
export class PaginatedChatListDTO {
  items!: EnhancedChatListItemDTO[];
  totalCount!: number;
  hasMore!: boolean;
  nextPage?: number;
} 