import { MessageType } from "../enum/Message-type.enum";
import { ChatId } from "../value-object/ChatId";
import { MessageContent } from "../value-object/MessageContent";
import { MessageId } from "../value-object/MessageId";
import { Timestamp } from "../value-object/Timestamp";
import { UserId } from "../value-object/UserId";

export interface MessageProps {
  id: MessageId;
  chatId: ChatId;
  senderId: UserId;
  content?: MessageContent | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  type: MessageType;
  isRead: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp | null;
}