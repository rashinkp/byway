import { ChatId } from "../value-object/ChatId";
import { UserId } from "../value-object/UserId";
import { Message } from "./message.entity";
import { Timestamp } from "../value-object/Timestamp";

export class Chat {
  public readonly messages: Message[] = [];

  constructor(
    public readonly user1Id: UserId,
    public readonly user2Id: UserId,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
    public readonly id ?: ChatId,
    messages?: Message[]
  ) {
    if (messages) {
      this.messages = messages;
    }
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
