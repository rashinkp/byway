import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDTO } from '../../domain/dtos/notification.dto';

export interface NotificationRepositoryInterface {
  create(notification: Notification): Promise<NotificationDTO>;
  findById(id: string): Promise<NotificationDTO | null>;
  findByUserId(userId: string): Promise<NotificationDTO[]>;
  deleteById(id: string): Promise<void>;
  deleteExpired(): Promise<number>; // returns number of deleted
  // Add more query methods as needed
} 