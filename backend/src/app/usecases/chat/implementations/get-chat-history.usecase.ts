import { IGetChatHistoryUseCase } from "../interfaces/get-chat-history.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { UserId } from "../../../../domain/value-object/UserId";
import { ChatResponseDTO } from "../../../dtos/chat.dto";

export class GetChatHistoryUseCase implements IGetChatHistoryUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(
    user1Id: UserId,
    user2Id: UserId
  ): Promise<ChatResponseDTO | null> {
    const chat = await this.chatRepository.getChatBetweenUsers(
      user1Id,
      user2Id
    );

    if (!chat) {
      return null;
    }

    return {
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      updatedAt: chat.updatedAt?.toString(),
      messages: chat.messages,
      createdAt: chat.createdAt?.value.toString(),
      id: chat.id,
    };
  }
}
