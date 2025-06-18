import { MessageResponseDTO } from '@/domain/dtos/chat.dto';
import { ChatId } from '../../../../domain/value-object/ChatId';

export interface IGetMessagesByChatUseCase {
  execute(chatId: ChatId): Promise<MessageResponseDTO[]>;
} 