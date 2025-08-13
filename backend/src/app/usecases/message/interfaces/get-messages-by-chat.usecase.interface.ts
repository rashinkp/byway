import { MessageResponseDTO } from "../../../dtos/message.dto";
import { ChatId } from "../../../../domain/value-object/ChatId";

export interface IGetMessagesByChatUseCase {
  execute(
    chatId: ChatId,
    limit?: number,
    beforeMessageId?: string
  ): Promise<MessageResponseDTO[]>;
}
