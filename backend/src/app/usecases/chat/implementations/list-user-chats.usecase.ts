import { IListUserChatsUseCase } from "../interfaces/list-user-chats.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { UserId } from "../../../../domain/value-object/UserId";
import { PaginatedChatListDTO } from "../../../dtos/chat.dto";

export class ListUserChatsUseCase implements IListUserChatsUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(
    userId: UserId,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort?: string,
    filter?: string
  ): Promise<PaginatedChatListDTO> {
    return this.chatRepository.findEnhancedChatList(
      userId,
      page,
      limit,
      search,
      sort,
      filter
    );
  }

  async getChatParticipantsById(
    chatId: string
  ): Promise<{ user1Id: string; user2Id: string } | null> {
    const chat = await this.chatRepository.findById({ value: chatId });
    if (!chat) return null;
    return { user1Id: chat.user1Id.value, user2Id: chat.user2Id.value };
  }
}
