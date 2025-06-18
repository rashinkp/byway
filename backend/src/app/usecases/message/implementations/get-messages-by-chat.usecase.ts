import { IGetMessagesByChatUseCase } from '../interfaces/get-messages-by-chat.usecase.interface';
import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { ChatId } from '../../../../domain/value-object/ChatId';
import { EnrichedMessageDTO } from '../../../../domain/dtos/message.dto';

export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(chatId: ChatId): Promise<EnrichedMessageDTO[]> {
    return this.messageRepository.findByChatWithUserData(chatId);
  }
} 