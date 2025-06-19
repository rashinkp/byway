import { NotificationDTO } from '../../../../domain/dtos/notification.dto';

export interface GetUserNotificationsUseCaseInterface {
  execute(userId: string): Promise<NotificationDTO[]>;
} 