import { z } from "zod";
import { ICategoryIdInputDTO, ICreateCategoryInputDTO, IGetAllCategoriesInputDTO, IUpdateCategoryInputDTO } from "../../domain/dtos/category/category.dto";

export const validateCreateCategory = (
  data: unknown
): ICreateCategoryInputDTO => {
  return z
    .object({
      name: z
        .string()
        .min(1, "Category name cannot be empty")
        .max(100, "Category name cannot exceed 100 characters"),
      description: z.string().optional(),
      createdBy: z.string().uuid("Invalid user ID"),
    })
    .parse(data);
};

export const validateUpdateCategory = (
  data: unknown
): IUpdateCategoryInputDTO => {
  return z
    .object({
      id: z.string().uuid("Invalid category ID"),
      name: z
        .string()
        .min(1, "Category name cannot be empty")
        .max(100, "Category name cannot exceed 100 characters")
        .optional(),
      description: z.string().optional(),
    })
    .parse(data);
};

export const validateGetAllCategories = (
  data: unknown
): IGetAllCategoriesInputDTO => {
  return z
    .object({
      page: z.number().int().positive().default(1).optional(),
      limit: z.number().int().positive().default(10).optional(),
      search: z.string().default("").optional(),
      includeDeleted: z.boolean().default(false).optional(),
      sortBy: z.string().default("createdAt").optional(),
      sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
      filterBy: z.string().default("All").optional(),
    })
    .parse(data);
};

export const validateCategoryId = (data: unknown): ICategoryIdInputDTO => {
  return z
    .object({
      id: z.string().uuid("Invalid category ID"),
    })
    .parse(data);
};
