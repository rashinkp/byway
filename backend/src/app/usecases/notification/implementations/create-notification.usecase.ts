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
    const created = await this.notificationRepository.create(notification);
    return {
      id: created.id,
      userId: created.userId.value,
      eventType: created.eventType,
      entityType: created.entityType,
      entityId: created.entityId,
      entityName: created.entityName,
      message: created.message,
      link: created.link,
      createdAt: created.createdAt.value.toISOString(),
      expiresAt: created.expiresAt.value.toISOString(),
    };
  }
}
