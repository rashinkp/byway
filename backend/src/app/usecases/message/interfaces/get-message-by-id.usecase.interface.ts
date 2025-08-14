import { MessageByIdResponseDTO } from "../../../dtos/message.dto";
import { MessageId } from "../../../../domain/value-object/MessageId";

export interface IGetMessageByIdUseCase {
  execute(messageId: MessageId): Promise<MessageByIdResponseDTO | null>;
}
