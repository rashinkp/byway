import { ChatId } from '@/domain/value-object/ChatId';
import { Chat } from '../../domain/entities/Chat';
import { UserId } from '@/domain/value-object/UserId';
import { PaginatedChatListDTO } from '../../domain/dtos/chat.dto';

export interface IChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByUser(userId: UserId): Promise<Chat[]>;
  findEnhancedChatList(userId: UserId, page?: number, limit?: number, search?: string, sort?: string, filter?: string): Promise<PaginatedChatListDTO>;
  create(chat: Chat): Promise<Chat>;
  save(chat: Chat): Promise<void>;
  getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null>;
} 