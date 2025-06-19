import { GetUserNotificationsUseCaseInterface } from '../interfaces/get-user-notifications.usecase.interface';
import { NotificationRepositoryInterface } from '../../../repositories/notification-repository.interface';
import { NotificationDTO } from '../../../../domain/dtos/notification.dto';

export class GetUserNotificationsUseCase implements GetUserNotificationsUseCaseInterface {
  constructor(private readonly notificationRepository: NotificationRepositoryInterface) {}

  async execute(userId: string): Promise<NotificationDTO[]> {
    // Business logic (if any) goes here, not in the repository
    return this.notificationRepository.findByUserId(userId);
  }
}   