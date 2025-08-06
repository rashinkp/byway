import { NotificationEntityType } from "../enum/notification-entity-type.enum";
import { NotificationEventType } from "../enum/notification-event-type.enum";
import { Timestamp } from "../value-object/Timestamp";
import { UserId } from "../value-object/UserId";

export interface NotificationProps {
  id: string;
  userId: UserId;
  eventType: NotificationEventType;
  entityType: NotificationEntityType;
  entityId: string;
  entityName: string;
  message: string;
  link?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
  deletedAt?: Timestamp | null;
}
