import { UserId } from '@/domain/value-object/UserId';
import { Chat, } from '../../../../domain/entities/Chat';

export interface IGetChatHistoryUseCase {
  execute(user1Id: UserId, user2Id: UserId): Promise<Chat | null>;
} 