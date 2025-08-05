import { ChatRecord } from "../records/chat.record";

export interface IChatRepository {
  findById(id: string): Promise<ChatRecord | null>;
  findByUser(userId: string): Promise<ChatRecord[]>;
  create(chat: ChatRecord): Promise<ChatRecord>;
  save(chat: ChatRecord): Promise<ChatRecord>;
  getChatBetweenUsers(user1Id: string, user2Id: string): Promise<ChatRecord | null>;
  findEnhancedChatList(options: {
    userId: string;
    page?: number;
    limit?: number;
  }): Promise<{ chats: ChatRecord[]; total: number; totalPages: number }>;
}
