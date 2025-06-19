import { UserId } from '../../../../domain/value-object/UserId';
import { PaginatedChatListDTO } from '../../../../domain/dtos/chat.dto';

export interface IListUserChatsUseCase {
  execute(
    userId: UserId,
    page?: number,
    limit?: number,
    search?: string,
    sort?: string,
    filter?: string
  ): Promise<PaginatedChatListDTO>;
} 