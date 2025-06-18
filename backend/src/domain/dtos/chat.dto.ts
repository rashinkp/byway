import { MessageDTO } from './message.dto';

// Basic chat DTO for internal operations
export class ChatDTO {
  id!: string;
  user1Id!: string;
  user2Id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  messages!: MessageDTO[];
}

// Chat list DTO that matches Prisma structure
export class ChatListItemDTO {
  id!: string;
  user1Id!: string;
  user2Id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  user1!: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  user2!: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  messages!: Array<{
    id: string;
    content: string;
    createdAt: Date;
    sender: {
      name: string;
    };
  }>;
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

// DTO for creating new chats
export class CreateChatDTO {
  user1Id!: string;
  user2Id!: string;
} 