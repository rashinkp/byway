import { UserId } from "../../../../domain/value-object/UserId";
import { ChatResponseDTO } from "../../../dtos/chat.dto";

export interface ICreateChatUseCase {
  execute(user1Id: UserId, user2Id: UserId): Promise<ChatResponseDTO>;
}
