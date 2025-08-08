
import { Chat } from "../../../../domain/entities/chat.entity";
import { UserId } from "../../../../domain/value-object/UserId";

export interface IGetChatHistoryUseCase {
  execute(user1Id: UserId, user2Id: UserId): Promise<Chat | null>;
}
