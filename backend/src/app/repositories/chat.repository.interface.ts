import { Chat } from "../../domain/entities/chat.entity";
import { ChatId } from "../../domain/value-object/ChatId";
import { UserId } from "../../domain/value-object/UserId";


export interface IChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByUser(userId: UserId): Promise<Chat[]>;
  findEnhancedChatList(
    userId: UserId,
    page?: number,
    limit?: number,
    search?: string,
    sort?: string,
    filter?: string
  ): Promise<{
    items: Array<{
      id: string;
      type: "chat" | "user";
      displayName: string;
      avatar?: string;
      role: string;
      lastMessage?: {
        content?: string;
        imageUrl?: string;
        audioUrl?: string;
        type: "text" | "image" | "audio";
      };
      lastMessageTime?: string;
      unreadCount?: number;
      userId?: string;
      chatId?: string;
      isOnline?: boolean;
    }>;
    totalCount: number;
    hasMore: boolean;
    nextPage?: number;
  }>;
  create(chat: Chat): Promise<Chat>;
  save(chat: Chat): Promise<void>;
  getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null>;
}
