import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
  createdBy: z.string().uuid("Invalid user ID"),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
});

export const getAllCategoriesSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  includeDeleted: z.boolean().optional().default(false),
  search: z.string().optional().default(""),
  filterBy: z.enum(["All", "Active", "Inactive"]).optional().default("All"),
});

export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});
