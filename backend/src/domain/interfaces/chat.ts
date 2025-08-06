import { Message } from "../entities/message.entity";
import { ChatId } from "../value-object/ChatId";
import { Timestamp } from "../value-object/Timestamp";
import { UserId } from "../value-object/UserId";

export interface ChatProps {
  id: ChatId;
  user1Id: UserId;
  user2Id: UserId;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp | null;
  messages?: Message[];
}
