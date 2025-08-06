import { NotificationEventType } from "../enum/notification-event-type.enum";
import { UserId } from "../value-object/UserId";
import { Timestamp } from "../value-object/Timestamp";
import { NotificationEntityType } from "../enum/notification-entity-type.enum";
import { NotificationProps } from "../interfaces/notification";


export class Notification {
  private readonly _id: string;
  private readonly _userId: UserId;
  private readonly _eventType: NotificationEventType;
  private readonly _entityType: NotificationEntityType;
  private readonly _entityId: string;
  private readonly _entityName: string;
  private readonly _message: string;
  private readonly _link: string | null;
  private readonly _createdAt: Timestamp;
  private _updatedAt: Timestamp;
  private _expiresAt: Timestamp;
  private _deletedAt: Timestamp | null;

  constructor(props: NotificationProps) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }
    if (!props.entityId) {
      throw new Error("Entity ID is required");
    }
    if (!props.entityName || props.entityName.trim() === "") {
      throw new Error("Entity name is required and cannot be empty");
    }
    if (!props.message || props.message.trim() === "") {
      throw new Error("Message is required and cannot be empty");
    }
    if (props.expiresAt.value <= new Date()) {
      throw new Error("Expiration date must be in the future");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._eventType = props.eventType;
    this._entityType = props.entityType;
    this._entityId = props.entityId;
    this._entityName = props.entityName.trim();
    this._message = props.message.trim();
    this._link = props.link ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._expiresAt = props.expiresAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Notification is already deleted");
    }
    this._deletedAt = new Timestamp(new Date());
    this._updatedAt = new Timestamp(new Date());
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Notification is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Timestamp(new Date());
  }

  isActive(): boolean {
    return !this._deletedAt && this._expiresAt.value > new Date();
  }

  get id(): string {
    return this._id;
  }

  get userId(): UserId {
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

  get createdAt(): Timestamp {
    return this._createdAt;
  }

  get updatedAt(): Timestamp {
    return this._updatedAt;
  }

  get expiresAt(): Timestamp {
    return this._expiresAt;
  }

  get deletedAt(): Timestamp | null {
    return this._deletedAt;
  }
}
