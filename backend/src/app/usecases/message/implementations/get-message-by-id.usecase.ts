import { IGetMessageByIdUseCase } from "../interfaces/get-message-by-id.usecase.interface";
import { IMessageRepository } from "../../../repositories/message.repository.interface";
import { MessageByIdResponseDTO } from "../../../dtos/message.dto";
import { MessageId } from "../../../../domain/value-object/MessageId";

export class GetMessageByIdUseCase implements IGetMessageByIdUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(messageId: MessageId): Promise<MessageByIdResponseDTO | null> {
    const message = await this.messageRepository.findById(messageId);
    
    if (!message) {
      return null;
    }

    // Map domain entity to DTO
    return {
      id: message.id?.value || "",
      chatId: message.chatId.value,
      senderId: message.senderId.value,
      content: message.content?.value || undefined,
      imageUrl: message.imageUrl || undefined,
      audioUrl: message.audioUrl || undefined,
      isRead: message.isRead,
      type: message.type,
      createdAt: message.createdAt.value.toISOString(),
      sender: {
        id: message.senderId.value,
        name: "",
        role: "",
      }
    };
  }
}
