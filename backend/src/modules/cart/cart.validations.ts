import { z } from "zod";

export const createCartSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  userId: z.string().uuid("Invalid user ID"),
});

export const getCartSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  includeDeleted: z.boolean().optional().default(false),
});

export const removeCartItemSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courseId: z.string().uuid("Invalid course ID"),
});

export const clearCartSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});
