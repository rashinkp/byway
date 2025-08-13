import { NotificationRepositoryInterface } from "../../app/repositories/notification-repository.interface";
import { Notification } from "../../domain/entities/notification.entity";
import { PrismaClient } from "@prisma/client";
import { NotificationEntityType } from "../../domain/enum/notification-entity-type.enum";
import { NotificationEventType } from "../../domain/enum/notification-event-type.enum";
import { UserId } from "../../domain/value-object/UserId";
import { Timestamp } from "../../domain/value-object/Timestamp";
import { PaginatedNotificationList } from "../../domain/types/notification.interface";

export class PrismaNotificationRepository
  implements NotificationRepositoryInterface
{
  constructor(private readonly prisma: PrismaClient) {}

  private mapEntityType(
    entityType: NotificationEntityType
  ):
    | "COURSE"
    | "CHAT"
    | "USER"
    | "ASSIGNMENT"
    | "GENERAL"
    | "PAYMENT"
    | "REVIEW" {
    switch (entityType) {
      case NotificationEntityType.COURSE:
        return "COURSE";
      case NotificationEntityType.CHAT:
        return "CHAT";
      case NotificationEntityType.USER:
        return "USER";
      case NotificationEntityType.ASSIGNMENT:
        return "ASSIGNMENT";
      case NotificationEntityType.GENERAL:
        return "GENERAL";
      case NotificationEntityType.PAYMENT:
        return "PAYMENT";
      case NotificationEntityType.REVIEW:
        return "REVIEW";
      case NotificationEntityType.INSTRUCTOR:
        return "USER"; // Map INSTRUCTOR to USER since Prisma doesn't have INSTRUCTOR
      default:
        return "GENERAL";
    }
  }

  private toDomain(row: any): Notification {
    return new Notification(
      row.id,
      new UserId(row.userId),
      row.eventType as NotificationEventType,
      row.entityType as NotificationEntityType,
      row.entityId,
      row.entityName,
      row.message,
      row.link,
      new Timestamp(row.createdAt),
      new Timestamp(row.expiresAt)
    );
  }

  async create(notification: Notification): Promise<Notification> {
    const created = await this.prisma.notification.create({
      data: {
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
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Notification | null> {
    const found = await this.prisma.notification.findUnique({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const found = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((n) => this.toDomain(n));
  }

  async findManyByUserId(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    eventType?: string;
    search?: string;
  }): Promise<PaginatedNotificationList> {
    const {
      userId,
      skip = 0,
      take = 5,
      sortBy = "createdAt",
      sortOrder = "desc",
      eventType,
      search,
    } = options;
    const where: any = { userId };
    if (eventType) where.eventType = eventType;
    if (search) {
      where.OR = [
        { message: { contains: search, mode: "insensitive" } },
        { entityName: { contains: search, mode: "insensitive" } },
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
      items: items.map((n) => this.toDomain(n)),
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
}
