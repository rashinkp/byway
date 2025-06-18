import { UserId } from '@/domain/value-object/UserId';
import { ChatId } from '@/domain/value-object/ChatId';
import { MessageContent } from '@/domain/value-object/MessageContent';
import { EnrichedMessageDTO } from '../../../../domain/dtos/message.dto';

export interface ISendMessageUseCase {
  execute(chatId: ChatId, senderId: UserId, content: MessageContent): Promise<EnrichedMessageDTO>;
} 