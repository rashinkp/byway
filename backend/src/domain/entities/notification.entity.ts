import { NotificationEventType } from '../enum/notification-event-type.enum';
import { NotificationEntityType } from '../enum/notification-entity-type.enum';

export class Notification {
  private readonly _id: string;
  private _userId: string;
  private _eventType: NotificationEventType;
  private _entityType: NotificationEntityType;
  private _entityId: string;
  private _entityName: string;
  private _message: string;
  private _link: string | null;
  private _createdAt: Date;
  private _expiresAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    eventType: NotificationEventType;
    entityType: NotificationEntityType;
    entityId: string;
    entityName: string;
    message: string;
    link?: string | null;
    createdAt: Date;
    expiresAt: Date;
  }) {
    this.validateNotification(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._eventType = props.eventType;
    this._entityType = props.entityType;
    this._entityId = props.entityId;
    this._entityName = props.entityName;
    this._message = props.message;
    this._link = props.link ?? null;
    this._createdAt = props.createdAt;
    this._expiresAt = props.expiresAt;
  }

  private validateNotification(props: any): void {
    if (!props.id) {
      throw new Error("Notification ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.eventType) {
      throw new Error("Event type is required");
    }

    if (!props.entityType) {
      throw new Error("Entity type is required");
    }

    if (!props.entityId) {
      throw new Error("Entity ID is required");
    }

    if (!props.entityName || props.entityName.trim() === "") {
      throw new Error("Entity name is required");
    }

    if (!props.message || props.message.trim() === "") {
      throw new Error("Message is required");
    }

    if (props.message.length > 500) {
      throw new Error("Message cannot exceed 500 characters");
    }

    if (props.expiresAt <= props.createdAt) {
      throw new Error("Expiry date must be after creation date");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get eventType(): NotificationEventType {
    return this._eventType;
  }

  get entityType(): NotificationEntityType {
    return this._entityType;
  }

  get entityId(): string {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  get message(): string {
    return this._message;
  }

  get link(): string | null {
    return this._link;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  // Business logic methods
  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  isActive(): boolean {
    return !this.isExpired();
  }

  hasLink(): boolean {
    return this._link !== null && this._link.trim() !== "";
  }

  getDaysUntilExpiry(): number {
    const now = new Date();
    const diffTime = this._expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
} 