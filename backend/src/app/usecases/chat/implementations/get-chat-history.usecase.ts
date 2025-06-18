import { IGetChatHistoryUseCase } from '../interfaces/get-chat-history.usecase.interface';
import { IChatRepository } from '../../../repositories/chat.repository.interface';
import { Chat } from '../../../../domain/entities/Chat';
import { UserId } from '@/domain/value-object/UserId';

export class GetChatHistoryUseCase implements IGetChatHistoryUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(user1Id: UserId, user2Id: UserId): Promise<Chat | null> {
    return this.chatRepository.getChatBetweenUsers(user1Id, user2Id);
  }
} 