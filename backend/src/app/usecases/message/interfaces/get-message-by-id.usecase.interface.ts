import { Message, MessageId } from '../../../../domain/entities/Message';

export interface IGetMessageByIdUseCase {
  execute(messageId: MessageId): Promise<Message | null>;
} 