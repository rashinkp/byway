
import { UserId } from '@/domain/value-object/UserId';
import { Message } from '../../../../domain/entities/Message';
import { ChatId } from '@/domain/value-object/ChatId';
import { MessageContent } from '@/domain/value-object/MessageContent';

export interface ISendMessageUseCase {
  execute(chatId: ChatId, senderId: UserId, content: MessageContent): Promise<Message>;
} 