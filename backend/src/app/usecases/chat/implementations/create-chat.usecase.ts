import { ICreateChatUseCase } from "../interfaces/create-chat.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { Chat } from "../../../../domain/entities/chat.entity";
import { UserId } from "../../../../domain/value-object/UserId";
import { ChatResponseDTO } from "../../../dtos/chat.dto";

export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(user1Id: UserId, user2Id: UserId): Promise<ChatResponseDTO> {
    const chat = new Chat(
      user1Id,
      user2Id,
    );
    const savedChat = await this._chatRepository.create(chat);

    // Properly map domain entity to DTO
    return {
      id: savedChat.id,
      user1Id: savedChat.user1Id,
      user2Id: savedChat.user2Id,
      updatedAt: savedChat.updatedAt?.value.toString(),
      createdAt: savedChat.createdAt?.value.toString(),
      messages: savedChat.messages
    };
  }
}
