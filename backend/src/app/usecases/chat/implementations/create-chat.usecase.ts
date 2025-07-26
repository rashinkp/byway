import { ICreateChatUseCase } from "../interfaces/create-chat.usecase.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { Chat } from "../../../../domain/entities/chat.entity";
import { UserId } from "../../../../domain/value-object/UserId";
import { ChatId } from "../../../../domain/value-object/ChatId";
import { Timestamp } from "../../../../domain/value-object/Timestamp";

export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(user1Id: UserId, user2Id: UserId): Promise<Chat> {
    const chat = new Chat(
      Math.random().toString(36).substring(2, 15) as unknown as ChatId,
      user1Id,
      user2Id,
      new Timestamp(new Date()),
      new Timestamp(new Date()),
      []
    );
    await this.chatRepository.create(chat);
    return chat;
  }
}
