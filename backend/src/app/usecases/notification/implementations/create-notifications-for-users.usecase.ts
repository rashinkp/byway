import { CreateNotificationsForUsersUseCaseInterface } from '../interfaces/create-notifications-for-users.usecase.interface';
import { NotificationRepositoryInterface } from '../../../repositories/notification-repository.interface';
import { Notification } from '../../../../domain/entities/notification.entity';
import { NotificationEventType } from '../../../../domain/enum/notification-event-type.enum';
import { NotificationEntityType } from '../../../../domain/enum/notification-entity-type.enum';

export class CreateNotificationsForUsersUseCase implements CreateNotificationsForUsersUseCaseInterface {
  constructor(private _notificationRepository: NotificationRepositoryInterface) {}

  async execute(userIds: string[], notificationData: {
    eventType: NotificationEventType;
    entityType: NotificationEntityType;
    entityId: string;
    entityName: string;
    message: string;
    link?: string | null;
  }): Promise<void> {
    for (const userId of userIds) {
      const notification = Notification.create({
        ...notificationData,
        userId,
        id: crypto.randomUUID(),
      });
      await this._notificationRepository.create(notification);
    }
  }
} 