import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid UUID");

const getUserNotificationsSchema = z.object({
  userId: uuidSchema,
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(50).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  eventType: z.string().optional(),
  search: z.string().optional(),
});

export const getUserNotificationsSchemaDef = {
  query: getUserNotificationsSchema,
};

export function validateGetUserNotifications(data: unknown) {
  return getUserNotificationsSchema.parse(data);
} 