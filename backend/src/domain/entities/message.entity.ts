import { MessageType } from '../enum/Message-type.enum';

export class Message {
  private readonly _id: string;
  private _chatId: string;
  private _senderId: string;
  private _content: string | null;
  private _imageUrl: string | null;
  private _audioUrl: string | null;
  private _type: MessageType;
  private _isRead: boolean;
  private _createdAt: Date;

  constructor(props: {
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    imageUrl?: string | null;
    audioUrl?: string | null;
    type: MessageType;
    isRead: boolean;
    createdAt: Date;
  }) {
    this.validateMessage(props);
    
    this._id = props.id;
    this._chatId = props.chatId;
    this._senderId = props.senderId;
    this._content = props.content ?? null;
    this._imageUrl = props.imageUrl ?? null;
    this._audioUrl = props.audioUrl ?? null;
    this._type = props.type;
    this._isRead = props.isRead;
    this._createdAt = props.createdAt;
  }

  private validateMessage(props: any): void {
    if (!props.id) {
      throw new Error("Message ID is required");
    }

    if (!props.chatId) {
      throw new Error("Chat ID is required");
    }

    if (!props.senderId) {
      throw new Error("Sender ID is required");
    }

    if (!props.type) {
      throw new Error("Message type is required");
    }

    if (props.content && props.content.length > 1000) {
      throw new Error("Message content cannot exceed 1000 characters");
    }

    if (props.type === MessageType.TEXT && !props.content) {
      throw new Error("Text messages must have content");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get chatId(): string {
    return this._chatId;
  }

  get senderId(): string {
    return this._senderId;
  }

  get content(): string | null {
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

  get createdAt(): Date {
    return this._createdAt;
  }

  // Business logic methods
  markAsRead(): void {
    this._isRead = true;
  }

  isFromUser(userId: string): boolean {
    return this._senderId === userId;
  }

  hasMedia(): boolean {
    return this._imageUrl !== null || this._audioUrl !== null;
  }

  isTextOnly(): boolean {
    return this._type === MessageType.TEXT && this._content !== null;
  }

  hasImage(): boolean {
    return this._imageUrl !== null && this._imageUrl.trim() !== "";
  }

  hasAudio(): boolean {
    return this._audioUrl !== null && this._audioUrl.trim() !== "";
  }

  hasContent(): boolean {
    return this._content !== null && this._content.trim() !== "";
  }
} 