import { MessageId } from '@/domain/value-object/MessageId';
import { Message } from '../../../../domain/entities/Message';

export interface IGetMessageByIdUseCase {
  execute(messageId: MessageId): Promise<Message | null>;
} 