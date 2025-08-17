import { DeleteNotificationUseCaseInterface } from '../interfaces/delete-notification.usecase.interface';
import { NotificationRepositoryInterface } from '../../../repositories/notification-repository.interface';

export class DeleteNotificationUseCase implements DeleteNotificationUseCaseInterface {
  constructor(private readonly _notificationRepository: NotificationRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    await this._notificationRepository.deleteById(id);
  }
} 