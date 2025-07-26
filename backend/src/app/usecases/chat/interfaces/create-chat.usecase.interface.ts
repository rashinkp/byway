import { UserId } from "@/domain/value-object/UserId";
import { Chat } from "../../../../domain/entities/chat.entity";

export interface ICreateChatUseCase {
  execute(user1Id: UserId, user2Id: UserId): Promise<Chat>;
}
