import { EventType, EntityType } from "@prisma/client";

export interface NotificationRecord {
  id: string;
  userId: string;
  eventType: EventType;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  message: string;
  link?: string | null;
  createdAt: Date;
  expiresAt: Date;
} 