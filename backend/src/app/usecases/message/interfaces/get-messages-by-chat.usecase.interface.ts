import { MessageResponseDTO } from "@/app/dtos/chat.dto";
import { ChatId } from "../../../../domain/value-object/ChatId";

export interface IGetMessagesByChatUseCase {
  execute(
    chatId: ChatId,
    limit?: number,
    beforeMessageId?: string
  ): Promise<MessageResponseDTO[]>;
}
