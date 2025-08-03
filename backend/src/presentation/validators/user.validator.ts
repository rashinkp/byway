import { z } from "zod";
import {
  GetAllUsersDto,
  ToggleDeleteUserDto,
  UpdateUserDto,
  GetUserDto,
} from "../../app/dtos/user/user.dto";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

const uuidSchema = z.string().uuid("Invalid UUID");

// Schemas
const getAllUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  includeDeleted: z.coerce.boolean().default(false),
  search: z.string().optional(),
  filterBy: z.enum(["All", "Active", "Inactive"]).optional(),
  role: z.enum(["USER", "INSTRUCTOR", "ADMIN"]).optional(),
});

const toggleDeleteUserSchema = z.object({
  id: uuidSchema,
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  role: z.enum(["USER", "INSTRUCTOR", "ADMIN"]).optional(),
});

const getUserSchema = z.object({
  userId: uuidSchema,
});

// Validation schemas for endpoints
export const getAllUsersSchemaDef: ValidationSchema = {
  query: getAllUsersSchema,
};

export const toggleDeleteUserSchemaDef: ValidationSchema = {
  params: z.object({ id: uuidSchema }),
  body: z.object({ deletedAt: z.enum(["true", "false"]) }),
};

export const updateUserSchemaDef: ValidationSchema = {
  body: updateUserSchema,
};

export const getUserSchemaDef: ValidationSchema = {
  params: getUserSchema,
};

// Validation functions
export function validateGetAllUsers(data: unknown): GetAllUsersDto {
  return getAllUsersSchema.parse(data);
}

export function validateToggleDeleteUser(data: unknown): ToggleDeleteUserDto {
  return toggleDeleteUserSchema.parse(data);
}

export function validateUpdateUser(data: unknown): UpdateUserDto {
  return updateUserSchema.parse(data);
}

export function validateGetUser(data: unknown): GetUserDto {
  return getUserSchema.parse(data);
}
