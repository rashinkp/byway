import { Chat, UserId } from '../../../../domain/entities/Chat';

export interface IListUserChatsUseCase {
  execute(userId: UserId): Promise<Chat[]>;
} 