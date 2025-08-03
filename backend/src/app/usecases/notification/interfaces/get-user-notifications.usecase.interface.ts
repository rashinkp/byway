import { PaginatedNotificationListDTO } from "../../../dtos/notification.dto";

export interface GetUserNotificationsUseCaseInterface {
  execute(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    eventType?: string;
    search?: string;
  }): Promise<PaginatedNotificationListDTO>;
}
