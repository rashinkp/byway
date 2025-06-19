import { CreateNotificationsForUsersUseCaseInterface } from '../interfaces/create-notifications-for-users.usecase.interface';
import { NotificationRepositoryInterface } from '../../../repositories/notification-repository.interface';
import { Notification } from '../../../../domain/entities/notification.entity';

export class CreateNotificationsForUsersUseCase implements CreateNotificationsForUsersUseCaseInterface {
  constructor(private notificationRepository: NotificationRepositoryInterface) {}

  async execute(userIds: string[], notificationData: any): Promise<void> {
    for (const userId of userIds) {
      const notification = Notification.create({
        ...notificationData,
        userId,
        id: crypto.randomUUID(),
      });
      await this.notificationRepository.create(notification);
    }
  }
} 