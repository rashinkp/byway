import { NotificationEventType } from '../enum/notification-event-type.enum';
import { UserId } from '../value-object/UserId';
import { Timestamp } from '../value-object/Timestamp';
import { NotificationEntityType } from '../enum/notification-entity-type.enum';

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: UserId,
    public readonly eventType: NotificationEventType,
    public readonly entityType: NotificationEntityType,
    public readonly entityId: string,
    public readonly entityName: string,
    public readonly message: string,
    public readonly link: string | null,
    public readonly createdAt: Timestamp,
    public readonly expiresAt: Timestamp
  ) {}

  static create(props: {
    id: string;
    userId: string;
    eventType: NotificationEventType;
    entityType: NotificationEntityType;
    entityId: string;
    entityName: string;
    message: string;
    link?: string | null;
    createdAt?: Date;
    expiresAt?: Date;
  }): Notification {
    return new Notification(
      props.id,
      new UserId(props.userId),
      props.eventType,
      props.entityType,
      props.entityId,
      props.entityName,
      props.message,
      props.link ?? null,
      new Timestamp(props.createdAt ?? new Date()),
      new Timestamp(props.expiresAt ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) // 3 months default
    );
  }

  static fromPersistence(raw: {
    id: string;
    userId: string;
    eventType: string;
    entityType: string;
    entityId: string;
    entityName: string;
    message: string;
    link: string | null;
    createdAt: Date;
    expiresAt: Date;
  }): Notification {
    return new Notification(
      raw.id,
      new UserId(raw.userId),
      raw.eventType as NotificationEventType,
      raw.entityType as NotificationEntityType,
      raw.entityId,
      raw.entityName,
      raw.message,
      raw.link,
      new Timestamp(raw.createdAt),
      new Timestamp(raw.expiresAt)
    );
  }
} 