import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid UUID");

const getUserNotificationsSchema = z.object({
  userId: uuidSchema,
});

export const getUserNotificationsSchemaDef = {
  query: getUserNotificationsSchema,
};

export function validateGetUserNotifications(data: unknown) {
  return getUserNotificationsSchema.parse(data);
} 