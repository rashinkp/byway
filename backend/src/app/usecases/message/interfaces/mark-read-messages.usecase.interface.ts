import { ChatId } from "@/domain/value-object/ChatId";
import { UserId } from "@/domain/value-object/UserId";

export interface IMarkReadMessagesUseCase {
  execute(chatId: ChatId, userId: UserId): Promise<void>;
} 