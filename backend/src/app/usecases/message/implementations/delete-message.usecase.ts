import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { MessageId } from '../../../../domain/value-object/MessageId';
import { IDeleteMessageUseCase } from '../interfaces/delete-message.usecase.interface';

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(messageId: MessageId): Promise<void> {
    await this.messageRepository.delete(messageId);
  }
} 