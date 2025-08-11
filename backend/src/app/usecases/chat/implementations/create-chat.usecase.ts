import { ICreateChatUseCase } from "../interfaces/create-chat.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { Chat } from "../../../../domain/entities/chat.entity";
import { UserId } from "../../../../domain/value-object/UserId";
import { Timestamp } from "../../../../domain/value-object/Timestamp";
import { ChatResponseDTO } from "../../../dtos/chat.dto";

export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(user1Id: UserId, user2Id: UserId): Promise<ChatResponseDTO> {
    const chat = new Chat(
      user1Id,
      user2Id,
    );
    await this.chatRepository.create(chat);


    

    return chat;
  }
}
