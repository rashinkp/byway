import { ChatId } from "@/domain/value-object/ChatId";
import { ChatRecord } from "../records/chat.record";
import { UserId } from "@/domain/value-object/UserId";

export interface IChatRepository {
  findById(id: ChatId): Promise<ChatRecord | null>;
  findByUser(userId: UserId): Promise<ChatRecord[]>;
  findEnhancedChatList(options: {
    userId: UserId;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    filter?: string;
  }): Promise<{ chats: ChatRecord[]; total: number; totalPages: number }>;
  create(chat: ChatRecord): Promise<ChatRecord>;
  save(chat: ChatRecord): Promise<void>;
  getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<ChatRecord | null>;
}
