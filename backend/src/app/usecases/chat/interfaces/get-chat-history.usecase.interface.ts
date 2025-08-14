import { UserId } from "../../../../domain/value-object/UserId";
import { ChatResponseDTO } from "../../../dtos/chat.dto";

export interface IGetChatHistoryUseCase {
  execute(user1Id: UserId, user2Id: UserId): Promise<ChatResponseDTO | null>;
}
