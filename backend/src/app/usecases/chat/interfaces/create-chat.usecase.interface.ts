import { Chat, UserId } from '../../../../domain/entities/Chat';

export interface ICreateChatUseCase {
  execute(user1Id: UserId, user2Id: UserId): Promise<Chat>;
} 