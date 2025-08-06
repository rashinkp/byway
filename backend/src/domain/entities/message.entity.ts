import { MessageId } from "../value-object/MessageId";
import { ChatId } from "../value-object/ChatId";
import { UserId } from "../value-object/UserId";
import { MessageContent } from "../value-object/MessageContent";
import { Timestamp } from "../value-object/Timestamp";
import { MessageType } from "../enum/Message-type.enum";
import { MessageProps } from "../interfaces/message";



export class Message {
  private readonly _id: MessageId;
  private readonly _chatId: ChatId;
  private readonly _senderId: UserId;
  private readonly _content: MessageContent | null;
  private readonly _imageUrl: string | null;
  private readonly _audioUrl: string | null;
  private readonly _type: MessageType;
  private _isRead: boolean;
  private readonly _createdAt: Timestamp;
  private _updatedAt: Timestamp;
  private _deletedAt: Timestamp | null;

  constructor(props: MessageProps) {
    if (!props.chatId) {
      throw new Error("Chat ID is required");
    }
    if (!props.senderId) {
      throw new Error("Sender ID is required");
    }
    if (
      props.type === MessageType.TEXT &&
      (!props.content || props.content.value.trim() === "")
    ) {
      throw new Error("Text message must have non-empty content");
    }
    if (props.type === MessageType.IMAGE && !props.imageUrl) {
      throw new Error("Image message must have an image URL");
    }
    if (props.type === MessageType.AUDIO && !props.audioUrl) {
      throw new Error("Audio message must have an audio URL");
    }

    this._id = props.id;
    this._chatId = props.chatId;
    this._senderId = props.senderId;
    this._content = props.content ?? null;
    this._imageUrl = props.imageUrl ?? null;
    this._audioUrl = props.audioUrl ?? null;
    this._type = props.type;
    this._isRead = props.isRead;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  markAsRead(): void {
    if (this._deletedAt) {
      throw new Error("Cannot mark deleted message as read");
    }
    if (this._isRead) {
      throw new Error("Message is already read");
    }
    this._isRead = true;
    this._updatedAt = new Timestamp(new Date());
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Message is already deleted");
    }
    this._deletedAt = new Timestamp(new Date());
    this._updatedAt = new Timestamp(new Date());
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Message is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Timestamp(new Date());
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  isFromUser(userId: UserId): boolean {
    return this._senderId.value === userId.value;
  }

  hasMedia(): boolean {
    return this._imageUrl !== null || this._audioUrl !== null;
  }

  isTextOnly(): boolean {
    return this._type === MessageType.TEXT && this._content !== null;
  }

  get id(): MessageId {
    return this._id;
  }

  get chatId(): ChatId {
    return this._chatId;
  }

  get senderId(): UserId {
    return this._senderId;
  }

  get content(): MessageContent | null {
    return this._content;
  }

  get imageUrl(): string | null {
    return this._imageUrl;
  }

  get audioUrl(): string | null {
    return this._audioUrl;
  }

  get type(): MessageType {
    return this._type;
  }

  get isRead(): boolean {
    return this._isRead;
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
}
