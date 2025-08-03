import { CreateNotificationUseCaseInterface } from "../interfaces/create-notification.usecase.interface";
import { NotificationRepositoryInterface } from "../../../repositories/notification-repository.interface";
import { Notification } from "../../../../domain/entities/notification.entity";
import { NotificationDTO } from "../../../dtos/notification.dto";

export class CreateNotificationUseCase
  implements CreateNotificationUseCaseInterface
{
  constructor(
    private readonly notificationRepository: NotificationRepositoryInterface
  ) {}

  async execute(notification: Notification): Promise<NotificationDTO> {
    // Business logic (if any) goes here, not in the repository
    return this.notificationRepository.create(notification);
  }
}
