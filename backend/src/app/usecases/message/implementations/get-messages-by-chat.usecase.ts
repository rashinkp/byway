import { IGetMessagesByChatUseCase } from "../interfaces/get-messages-by-chat.usecase.interface";
import { IMessageRepository } from "../../../repositories/message.repository.interface";
import { IChatRepository } from "../../../repositories/chat.repository.interface";
import { ChatId } from "../../../../domain/value-object/ChatId";
import { MessageResponseDTO } from "@/app/dtos/chat.dto";

export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(
    chatId: ChatId,
    limit = 20,
    beforeMessageId?: string
  ): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findByChatWithUserData(
      chatId,
      limit,
      beforeMessageId
    );
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) return [];
    return messages.map((msg) => {
      // Infer receiverId: the other participant in the chat
      const receiverId =
        chat.user1Id.value === msg.senderId
          ? chat.user2Id.value
          : chat.user1Id.value;
      return {
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        receiverId,
        content: msg.content ? msg.content : undefined, // Handle optional content
        imageUrl: msg.imageUrl ? msg.imageUrl : undefined, // Include S3 image URL
        audioUrl: msg.audioUrl ? msg.audioUrl : undefined, // Include S3 audio URL
        isRead: msg.isRead,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toISOString() : "",
      };
    });
  }
}
