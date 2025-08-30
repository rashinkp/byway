import { IListUserChatsUseCase } from "../interfaces/list-user-chats.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { UserId } from "../../../../domain/value-object/UserId";
import { PaginatedChatListDTO } from "../../../dtos/chat.dto";

export class ListUserChatsUseCase implements IListUserChatsUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(
    userId: UserId,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort?: string,
    filter?: string
  ): Promise<PaginatedChatListDTO> {
    const result = await this._chatRepository.findEnhancedChatList(
      userId,
      page,
      limit,
      search,
      sort
    );

    // Map repository result to DTO format
    return {
      items: result.items.map(item => ({
        id: item.id,
        type: item.type,
        displayName: item.displayName,
        avatar: item.avatar,
        role: item.role,
        lastMessage: item.lastMessage,
        lastMessageTime: item.lastMessageTime,
        unreadCount: item.unreadCount,
        userId: item.userId,
        chatId: item.chatId,
        isOnline: item.isOnline,
      })),
      totalCount: result.totalCount,
      hasMore: result.hasMore,
      nextPage: result.nextPage,
    };
  }

  async getChatParticipantsById(
    chatId: string
  ): Promise<{ user1Id: string; user2Id: string } | null> {
    const chat = await this._chatRepository.findById({ value: chatId });
    if (!chat) return null;
    return { user1Id: chat.user1Id.value, user2Id: chat.user2Id.value };
  }
}
