import { IGetMessagesByChatUseCase } from '../interfaces/get-messages-by-chat.usecase.interface';
import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { IChatRepository } from '../../../repositories/chat.repository.interface';
import { ChatId } from '../../../../domain/value-object/ChatId';
import { MessageResponseDTO } from '@/domain/dtos/chat.dto';

export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(chatId: ChatId): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findByChatWithUserData(chatId);
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) return [];
    return messages.map((msg) => {
      // Infer receiverId: the other participant in the chat
      let receiverId = chat.user1Id.value === msg.senderId ? chat.user2Id.value : chat.user1Id.value;
      return {
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        receiverId,
        content: msg.content,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toISOString() : '',
      };
    });
  }
} 