import { NotificationRepositoryInterface } from '../../app/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDTO } from '../../domain/dtos/notification.dto';

// In-memory implementation for testing/development only
export class InMemoryNotificationRepository implements NotificationRepositoryInterface {
  private notifications: NotificationDTO[] = [];

  async create(notification: Notification): Promise<NotificationDTO> {
    const dto: NotificationDTO = {
      ...notification,
      userId: notification.userId.value,
      createdAt: notification.createdAt.value.toISOString(),
      expiresAt: notification.expiresAt.value.toISOString(),
    };
    this.notifications.push(dto);
    return dto;
  }

  async findById(id: string): Promise<NotificationDTO | null> {
    return this.notifications.find(n => n.id === id) || null;
  }

  async findByUserId(userId: string): Promise<NotificationDTO[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async deleteById(id: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    const before = this.notifications.length;
    this.notifications = this.notifications.filter(n => new Date(n.expiresAt) > now);
    return before - this.notifications.length;
  }
} 