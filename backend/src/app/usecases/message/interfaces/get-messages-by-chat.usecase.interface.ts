import { ChatId } from '../../../../domain/value-object/ChatId';
import { EnrichedMessageDTO } from '../../../../domain/dtos/message.dto';

export interface IGetMessagesByChatUseCase {
  execute(chatId: ChatId): Promise<EnrichedMessageDTO[]>;
} 