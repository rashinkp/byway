import { DeleteNotificationUseCaseInterface } from '../interfaces/delete-notification.usecase.interface';
import { NotificationRepositoryInterface } from '../../../repositories/notification-repository.interface';

export class DeleteNotificationUseCase implements DeleteNotificationUseCaseInterface {
  constructor(private readonly notificationRepository: NotificationRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    // Business logic (if any) goes here, not in the repository
    await this.notificationRepository.deleteById(id);
  }
} 