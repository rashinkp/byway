import { z } from "zod";
import {
  ICreateCategoryInputDTO,
  IUpdateCategoryInputDTO,
  IGetAllCategoriesInputDTO,
  ICategoryIdInputDTO,
} from "../../app/dtos/category.dto";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// Reusable schemas
const uuidSchema = z.string().uuid("Invalid UUID");

// CreateCategory schema
const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters"),
  description: z.string(),
  createdBy: uuidSchema,
});

// UpdateCategory schema
const updateCategorySchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters")
    .optional(),
  description: z.string().optional(),
});

// GetAllCategories schema
const getAllCategoriesSchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().default(10).optional(),
  search: z.string().default("").optional(),
  includeDeleted: z
    .string()
    .default("false")
    .transform((val) => val === "true")
    .optional(),
  sortBy: z.string().default("createdAt").optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
  filterBy: z.string().default("All").optional(),
});

// CategoryId schema
const categoryIdSchema = z.object({
  id: uuidSchema,
});

// Validation schemas for endpoints
export const createCategorySchemaValidator: ValidationSchema = {
  body: createCategorySchema,
};

export const updateCategorySchemaValidator: ValidationSchema = {
  body: updateCategorySchema,
};

export const getAllCategoriesSchemaValidator: ValidationSchema = {
  query: getAllCategoriesSchema,
};

export const getCategoryByIdSchema: ValidationSchema = {
  params: categoryIdSchema,
};

export const deleteCategorySchema: ValidationSchema = {
  params: categoryIdSchema,
};

// Validation functions
export function validateCreateCategory(data: unknown): ICreateCategoryInputDTO {
  return createCategorySchema.parse(data);
}

export function validateUpdateCategory(data: unknown): IUpdateCategoryInputDTO {
  return updateCategorySchema.parse(data);
}

export function validateGetAllCategories(
  data: unknown
): IGetAllCategoriesInputDTO {
  return getAllCategoriesSchema.parse(data);
}

export function validateCategoryId(data: unknown): ICategoryIdInputDTO {
  return categoryIdSchema.parse(data);
}
