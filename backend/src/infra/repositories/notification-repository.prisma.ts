import { NotificationRepositoryInterface } from '../../app/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDTO } from '../../domain/dtos/notification.dto';
import  { PrismaClient}  from '@prisma/client';
import { NotificationEntityType } from '../../domain/enum/notification-entity-type.enum';

export class PrismaNotificationRepository implements NotificationRepositoryInterface {
    constructor(private readonly prisma: PrismaClient) {}

    private mapEntityType(entityType: NotificationEntityType): 'COURSE' | 'CHAT' | 'USER' | 'ASSIGNMENT' | 'GENERAL' | 'PAYMENT' | 'REVIEW' {
        switch (entityType) {
            case NotificationEntityType.COURSE:
                return 'COURSE';
            case NotificationEntityType.CHAT:
                return 'CHAT';
            case NotificationEntityType.USER:
                return 'USER';
            case NotificationEntityType.ASSIGNMENT:
                return 'ASSIGNMENT';
            case NotificationEntityType.GENERAL:
                return 'GENERAL';
            case NotificationEntityType.PAYMENT:
                return 'PAYMENT';
            case NotificationEntityType.REVIEW:
                return 'REVIEW';
            case NotificationEntityType.INSTRUCTOR:
                return 'USER'; // Map INSTRUCTOR to USER since Prisma doesn't have INSTRUCTOR
            default:
                return 'GENERAL';
        }
    }

  async create(notification: Notification): Promise<NotificationDTO> {
    const created = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId.value,
        eventType: notification.eventType,
        entityType: this.mapEntityType(notification.entityType),
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

  async findManyByUserId(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    eventType?: string;
    search?: string;
  }): Promise<{ items: NotificationDTO[]; total: number; hasMore: boolean; nextPage?: number }> {
    const {
      userId,
      skip = 0,
      take = 5,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      eventType,
      search,
    } = options;
    const where: any = { userId };
    if (eventType) where.eventType = eventType;
    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { entityName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      this.prisma.notification.count({ where }),
    ]);
    const hasMore = skip + take < total;
    const nextPage = hasMore ? Math.floor(skip / take) + 2 : undefined;
    return {
      items: items.map(this.toDTO),
      total,
      hasMore,
      nextPage,
    };
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