import { IGetMessagesByChatUseCase } from '../interfaces/get-messages-by-chat.usecase.interface';
import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { Message } from '../../../../domain/entities/Message';
import { ChatId } from '../../../../domain/value-object/ChatId';

export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(chatId: ChatId): Promise<Message[]> {
    return this.messageRepository.findByChat(chatId);
  }
} 