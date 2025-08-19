import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { MessageId } from '../../../../domain/value-object/MessageId';
import { IDeleteMessageUseCase } from '../interfaces/delete-message.usecase.interface';
import { DeleteMessageResponseDTO } from '../../../dtos/message.dto';

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly _messageRepository: IMessageRepository) {}

  async execute(messageId: MessageId): Promise<DeleteMessageResponseDTO> {
    await this._messageRepository.delete(messageId.value);
    
    return {
      success: true,
      messageId: messageId.value
    };
  }
} 