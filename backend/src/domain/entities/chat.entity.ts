import { ChatId } from "../value-object/ChatId";
import { UserId } from "../value-object/UserId";
import { Message } from "./message.entity";
import { Timestamp } from "../value-object/Timestamp";
import { ChatProps } from "../interfaces/chat";


export class Chat {
  private readonly _id: ChatId;
  private readonly _user1Id: UserId;
  private readonly _user2Id: UserId;
  private readonly _createdAt: Timestamp;
  private _updatedAt: Timestamp;
  private _deletedAt: Timestamp | null;
  private readonly _messages: Message[];

  constructor(props: ChatProps) {
    if (props.user1Id.value === props.user2Id.value) {
      throw new Error("A user cannot chat with themselves");
    }
    if (!props.user1Id) {
      throw new Error("User1 ID is required");
    }
    if (!props.user2Id) {
      throw new Error("User2 ID is required");
    }

    this._id = props.id;
    this._user1Id = props.user1Id;
    this._user2Id = props.user2Id;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
    this._messages = props.messages ? [...props.messages] : [];
  }

  addMessage(message: Message): void {
    if (this._deletedAt) {
      throw new Error("Cannot add message to a deleted chat");
    }
    if (!this.isParticipant(message.senderId)) {
      throw new Error("Sender is not a participant in this chat");
    }
    this._messages.push(message);
    this._updatedAt = new Timestamp(new Date());
  }

  isParticipant(userId: UserId): boolean {
    return (
      this._user1Id.value === userId.value ||
      this._user2Id.value === userId.value
    );
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Chat is already deleted");
    }
    this._deletedAt = new Timestamp(new Date());
    this._updatedAt = new Timestamp(new Date());
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Chat is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Timestamp(new Date());
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  get id(): ChatId {
    return this._id;
  }

  get user1Id(): UserId {
    return this._user1Id;
  }

  get user2Id(): UserId {
    return this._user2Id;
  }

  get createdAt(): Timestamp {
    return this._createdAt;
  }

  get updatedAt(): Timestamp {
    return this._updatedAt;
  }

  get deletedAt(): Timestamp | null {
    return this._deletedAt;
  }

  get messages(): ReadonlyArray<Message> {
    return this._messages;
  }
}
