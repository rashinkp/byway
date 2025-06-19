import { IListUserChatsUseCase } from '../interfaces/list-user-chats.usecase.interface';
import { IChatRepository } from '../../../repositories/chat.repository.interface';
import { UserId } from '../../../../domain/value-object/UserId';
import { PaginatedChatListDTO } from '../../../../domain/dtos/chat.dto';

export class ListUserChatsUseCase implements IListUserChatsUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(userId: UserId, page: number = 1, limit: number = 10, search?: string, sort?: string, filter?: string): Promise<PaginatedChatListDTO> {
    return this.chatRepository.findEnhancedChatList(userId, page, limit, search, sort, filter);
  }
}