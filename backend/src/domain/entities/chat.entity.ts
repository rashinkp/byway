import { ChatId } from "../value-object/ChatId";
import { UserId } from "../value-object/UserId";
import { Message } from "./message.entity";
import { Timestamp } from "../value-object/Timestamp";

export class Chat {
  private readonly _id: string;
  private _user1Id: string;
  private _user2Id: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateChat(props);
    
    this._id = props.id;
    this._user1Id = props.user1Id;
    this._user2Id = props.user2Id;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateChat(props: any): void {
    if (!props.id) {
      throw new Error("Chat ID is required");
    }

    if (!props.user1Id) {
      throw new Error("User 1 ID is required");
    }

    if (!props.user2Id) {
      throw new Error("User 2 ID is required");
    }

    if (props.user1Id === props.user2Id) {
      throw new Error("A user cannot chat with themselves");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get user1Id(): string {
    return this._user1Id;
  }

  get user2Id(): string {
    return this._user2Id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  isParticipant(userId: string): boolean {
    return this._user1Id === userId || this._user2Id === userId;
  }

  getOtherParticipant(userId: string): string {
    if (this._user1Id === userId) {
      return this._user2Id;
    }
    if (this._user2Id === userId) {
      return this._user1Id;
    }
    throw new Error("User is not a participant in this chat");
  }

  updateTimestamp(): void {
    this._updatedAt = new Date();
  }
}
