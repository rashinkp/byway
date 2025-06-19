import { NotificationEventType } from '../../../../domain/enum/notification-event-type.enum';
import { NotificationEntityType } from '../../../../domain/enum/notification-entity-type.enum';

export interface CreateNotificationsForUsersUseCaseInterface {
  execute(
    userIds: string[],
    notificationData: {
      eventType: NotificationEventType;
      entityType: NotificationEntityType;
      entityId: string;
      entityName: string;
      message: string;
      link?: string | null;
    }
  ): Promise<void>;
} 