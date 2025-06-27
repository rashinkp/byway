import { IMarkReadMessagesUseCase } from '../interfaces/mark-read-messages.usecase.interface';
import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { ChatId } from '../../../../domain/value-object/ChatId';
import { UserId } from '../../../../domain/value-object/UserId';

export class MarkReadMessagesUseCase implements IMarkReadMessagesUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(chatId: ChatId, userId: UserId): Promise<void> {
    await this.messageRepository.markAllAsRead(chatId, userId);
  }
} 