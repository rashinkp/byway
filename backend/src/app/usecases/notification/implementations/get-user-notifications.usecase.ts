import { GetUserNotificationsUseCaseInterface } from "../interfaces/get-user-notifications.usecase.interface";
import { NotificationRepositoryInterface } from "../../../repositories/notification-repository.interface";
import { PaginatedNotificationListDTO, NotificationDTO } from "../../../dtos/notification.dto";

export class GetUserNotificationsUseCase
  implements GetUserNotificationsUseCaseInterface
{
  constructor(
    private readonly _notificationRepository: NotificationRepositoryInterface
  ) {}

  async execute(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    eventType?: string;
    search?: string;
  }): Promise<PaginatedNotificationListDTO> {
    const result = await this._notificationRepository.findManyByUserId(options);
    return {
      items: result.items.map((n) => ({
        id: n.id,
        userId: n.userId.value,
        eventType: n.eventType,
        entityType: n.entityType,
        entityId: n.entityId,
        entityName: n.entityName,
        message: n.message,
        link: n.link,
        createdAt: n.createdAt.value.toISOString(),
        expiresAt: n.expiresAt.value.toISOString(),
      } as NotificationDTO)),
      total: result.total,
      hasMore: result.hasMore,
      nextPage: result.nextPage,
    };
  }
}
