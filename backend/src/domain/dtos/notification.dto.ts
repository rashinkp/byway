import { NotificationEventType } from '../enum/notification-event-type.enum';
import { NotificationEntityType } from '../enum/notification-entity-type.enum';

export class NotificationDTO {
  id!: string;
  userId!: string;
  eventType!: NotificationEventType;
  entityType!: NotificationEntityType;
  entityId!: string;
  entityName!: string;
  message!: string;
  link?: string | null;
  createdAt!: string;
  expiresAt!: string;
}

export class PaginatedNotificationListDTO {
  items!: NotificationDTO[];
  total!: number;
  hasMore!: boolean;
  nextPage?: number;
} 