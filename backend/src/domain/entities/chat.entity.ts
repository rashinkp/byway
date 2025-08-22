import { ChatId } from "../value-object/ChatId";
import { UserId } from "../value-object/UserId";
import { Message } from "./message.entity";
import { Timestamp } from "../value-object/Timestamp";

export class Chat {
  public readonly messages: Message[] = [];

  constructor(
    public readonly user1Id: UserId,
    public readonly user2Id: UserId,
    public readonly createdAt?: Timestamp,
    public readonly updatedAt?: Timestamp,
    messages?: Message[],
    public readonly id?: ChatId 
  ) {
    if (messages) {
      this.messages = messages;
    }
  }

  static fromPersistence(raw: {
    user1Id: string;
    user2Id: string;
    createdAt: Date;
    updatedAt: Date;
    id?: string;
  }): Chat {
    return new Chat(
      new UserId(raw.user1Id),
      new UserId(raw.user2Id),
      new Timestamp(raw.createdAt),
      new Timestamp(raw.updatedAt),
      undefined,
      raw.id ? new ChatId(raw.id) : undefined
    );
  }

  // Business logic: Add a message to the chat
  addMessage(message: Message): void {
    if (!this.isParticipant(message.senderId)) {
      throw new Error("Sender is not a participant in this chat.");
    }
    if (this.user1Id.value === this.user2Id.value) {
      throw new Error("A user cannot chat with themselves.");
    }
    this.messages.push(message);
  }

  // Business logic: Check if a user is a participant
  isParticipant(userId: UserId): boolean {
    return (
      this.user1Id.value === userId.value || this.user2Id.value === userId.value
    );
  }
}
