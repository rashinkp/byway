import { Message } from "../../domain/entities/message.entity";
import { ChatId } from "../../domain/value-object/ChatId";
import { UserId } from "../../domain/value-object/UserId";

// DTO for message responses sent to frontend (minimal for one-to-one chat)
export interface MessageResponseDTO {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string; // The other user in the one-to-one chat
  content?: string; // Optional, as messages may only contain media
  imageUrl?: string; // S3 link for image
  audioUrl?: string; // S3 link for audio
  isRead: boolean; // Whether the message has been read
  timestamp: string; // ISO string for createdAt
}

// DTO for enhanced chat list items, including both chats and users
export class EnhancedChatListItemDTO {
  id!: string; 
  type!: "chat" | "user"; 
  displayName!: string; 
  avatar?: string; 
  role!: string; 
  lastMessage?: {
    content?: string; 
    imageUrl?: string; 
    audioUrl?: string; 
    type: "text" | "image" | "audio"; // Type of the last message
  }; 
  lastMessageTime?: string; // ISO string for the last message’s timestamp
  unreadCount?: number; // Number of unread messages in the chat
  userId?: string; // For user items, the other user’s ID
  chatId?: string; // For chat items, the chat ID
  isOnline?: boolean; // Whether the other user is online
}

// Paginated chat list response
export class PaginatedChatListDTO {
  items!: EnhancedChatListItemDTO[];
  totalCount!: number;
  hasMore!: boolean;
  nextPage?: number;
} 



export interface ChatResponseDTO {
  id?: ChatId;
  user1Id: UserId;
  user2Id: UserId;
  updatedAt?: string;
  createdAt?: string;
  messages: Message[];
}