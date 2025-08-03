import { Notification } from "../../../../domain/entities/notification.entity";
import { NotificationDTO } from "../../../dtos/notification.dto";

export interface CreateNotificationUseCaseInterface {
  execute(notification: Notification): Promise<NotificationDTO>;
}
