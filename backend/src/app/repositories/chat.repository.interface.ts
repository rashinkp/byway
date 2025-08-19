import { Chat } from "../../domain/entities/chat.entity";
import { ChatId } from "../../domain/value-object/ChatId";
import { UserId } from "../../domain/value-object/UserId";
import { IGenericRepository } from "./base/generic-repository.interface";

export class EnhancedChatListItem {
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
  lastMessageTime?: string; // ISO string for the last message's timestamp
  unreadCount?: number; // Number of unread messages in the chat
  userId?: string; // For user items, the other user's ID
  chatId?: string; // For chat items, the chat ID
  isOnline?: boolean; // Whether the other user is online
}

export class PaginatedChatList {
  items!: EnhancedChatListItem[];
  totalCount!: number;
  hasMore!: boolean;
  nextPage?: number;
} 

export interface IChatRepository extends IGenericRepository<Chat> {
  findByUser(userId: UserId): Promise<Chat[]>;
  findEnhancedChatList(
    userId: UserId,
    page?: number,
    limit?: number,
    search?: string,
    sort?: string,
    filter?: string
  ): Promise<PaginatedChatList>;
  save(chat: Chat): Promise<void>;
  getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null>;
}
