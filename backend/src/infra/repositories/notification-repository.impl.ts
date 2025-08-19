import { NotificationRepositoryInterface } from "../../app/repositories/notification-repository.interface";
import { Notification } from "../../domain/entities/notification.entity";
import { PrismaClient } from "@prisma/client";
import { NotificationEntityType } from "../../domain/enum/notification-entity-type.enum";
import { PaginatedNotificationList } from "../../domain/types/notification.interface";
import { GenericRepository } from "./generic.repository";

export class PrismaNotificationRepository
  extends GenericRepository<Notification>
  implements NotificationRepositoryInterface
{
  constructor(private readonly _prisma: PrismaClient) {
    super(_prisma, "notification");
  }

  protected getPrismaModel() {
    return this._prisma.notification;
  }

  protected mapToEntity(notification: any): Notification {
    return Notification.fromPersistence(notification);
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Notification) {
      return {
        userId: entity.userId.value,
        eventType: entity.eventType,
        entityType: this.mapEntityType(entity.entityType),
        entityId: entity.entityId,
        entityName: entity.entityName,
        message: entity.message,
        link: entity.link,
        createdAt: entity.createdAt.value,
        expiresAt: entity.expiresAt.value,
      };
    }
    return entity;
  }

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
        return "USER";
      default:
        return "GENERAL";
    }
  }

  async create(notification: Notification): Promise<Notification> {
    const created = await this._prisma.notification.create({
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
    return Notification.fromPersistence(created);
  }

  async findById(id: string): Promise<Notification | null> {
    return this.findByIdGeneric(id);
  }

  async find(filter?: any): Promise<Notification[]> {
    return this.findGeneric(filter);
  }

  async update(id: string, notification: Notification): Promise<Notification> {
    return this.updateGeneric(id, notification);
  }

  async delete(id: string): Promise<void> {
    return this.deleteGeneric(id);
  }

  async softDelete(id: string): Promise<Notification> {
    const updated = await this._prisma.notification.update({
      where: { id },
      data: { expiresAt: new Date() },
    });
    return this.mapToEntity(updated);
  }

  async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const found = await this._prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((n) => this.mapToEntity(n));
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
    const where: Record<string, unknown> = { userId };
    if (eventType) where.eventType = eventType;
    if (search) {
      where.OR = [
        { message: { contains: search, mode: "insensitive" } },
        { entityName: { contains: search, mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      this._prisma.notification.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      this._prisma.notification.count({ where }),
    ]);
    const hasMore = skip + take < total;
    const nextPage = hasMore ? Math.floor(skip / take) + 2 : undefined;
    return {
      items: items.map((n) => Notification.fromPersistence(n)),
      total,
      hasMore,
      nextPage,
    };
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteGeneric(id);
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    const deleted = await this._prisma.notification.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return deleted.count;
  }
}
