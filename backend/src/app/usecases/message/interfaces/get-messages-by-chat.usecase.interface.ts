import { ChatId } from '../../../../domain/entities/Chat';
import { Message } from '../../../../domain/entities/Message';

export interface IGetMessagesByChatUseCase {
  execute(chatId: ChatId): Promise<Message[]>;
} 