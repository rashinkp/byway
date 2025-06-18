import { MessageId } from '../../../../domain/value-object/MessageId';

export interface IDeleteMessageUseCase {
  execute(messageId: MessageId): Promise<void>;
} 