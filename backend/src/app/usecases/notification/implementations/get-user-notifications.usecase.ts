import { GetUserNotificationsUseCaseInterface } from "../interfaces/get-user-notifications.usecase.interface";
import { NotificationRepositoryInterface } from "../../../repositories/notification-repository.interface";
import { PaginatedNotificationListDTO } from "../../../dtos/notification.dto";

export class GetUserNotificationsUseCase
  implements GetUserNotificationsUseCaseInterface
{
  constructor(
    private readonly notificationRepository: NotificationRepositoryInterface
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
    return this.notificationRepository.findManyByUserId(options);
  }
}
