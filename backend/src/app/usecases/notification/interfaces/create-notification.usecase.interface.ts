import { Notification } from '../../../../domain/entities/notification.entity';
import { NotificationDTO } from '../../../../domain/dtos/notification.dto';

export interface CreateNotificationUseCaseInterface {
  execute(notification: Notification): Promise<NotificationDTO>;
} 