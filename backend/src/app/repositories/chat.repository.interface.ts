import { ChatId } from '@/domain/value-object/ChatId';
import { Chat } from '../../domain/entities/Chat';
import { UserId } from '@/domain/value-object/UserId';

export interface IChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByUser(userId: UserId): Promise<Chat[]>;
  create(chat: Chat): Promise<void>;
  save(chat: Chat): Promise<void>;
  getChatBetweenUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null>;
} 