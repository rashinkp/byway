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
    await this._chatRepository.create(chat);

      
    const dto = {
      user1Id: chat.user1Id,
      user2Id: chat.user2Id,
      updatedAt:chat.updatedAt?.value.toString(),
      createdAt: chat.createdAt?.value.toString(),
       messages: chat.messages
  }      

    return dto;
  }
}
