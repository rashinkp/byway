import { NotificationRepositoryInterface } from '../../app/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDTO } from '../../domain/dtos/notification.dto';
import  { PrismaClient}  from '@prisma/client';

export class PrismaNotificationRepository implements NotificationRepositoryInterface {
    constructor(private readonly prisma: PrismaClient) {}
  async create(notification: Notification): Promise<NotificationDTO> {
    const created = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId.value,
        eventType: notification.eventType,
        entityType: notification.entityType,
        entityId: notification.entityId,
        entityName: notification.entityName,
        message: notification.message,
        link: notification.link,
        createdAt: notification.createdAt.value,
        expiresAt: notification.expiresAt.value,
      },
    });
    return this.toDTO(created);
  }

  async findById(id: string): Promise<NotificationDTO | null> {
    const found = await this.prisma.notification.findUnique({ where: { id } });
    return found ? this.toDTO(found) : null;
  }

  async findByUserId(userId: string): Promise<NotificationDTO[]> {
    const found = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return found.map(this.toDTO);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    const deleted = await this.prisma.notification.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return deleted.count;
  }

  private toDTO(notification: any): NotificationDTO {
    return {
      id: notification.id,
      userId: notification.userId,
      eventType: notification.eventType,
      entityType: notification.entityType,
      entityId: notification.entityId,
      entityName: notification.entityName,
      message: notification.message,
      link: notification.link,
      createdAt: notification.createdAt.toISOString(),
      expiresAt: notification.expiresAt.toISOString(),
    };
  }
} 