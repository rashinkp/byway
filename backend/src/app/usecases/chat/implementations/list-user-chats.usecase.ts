import { IListUserChatsUseCase } from '../interfaces/list-user-chats.usecase.interface';
import { IChatRepository } from '../../../repositories/chat.repository.interface';
import { Chat } from '../../../../domain/entities/Chat';
import { UserId } from '../../../../domain/value-object/UserId';

export class ListUserChatsUseCase implements IListUserChatsUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(userId: UserId): Promise<Chat[]> {
    return this.chatRepository.findByUser(userId);
  }
} 