import { Message } from "../../../../domain/entities/message.entity";
import { MessageId } from "../../../../domain/value-object/MessageId";

export interface IGetMessageByIdUseCase {
  execute(messageId: MessageId): Promise<Message | null>;
}
